//处理树形数据
//dynamicRoutes.js
import axios from 'axios'
import router from './index';
import Layout from '@/layout/index.vue'
import storage from '@/utils/storage'
import { getDynamicIcon } from '@/utils'
const baseApiStr = 'apiDocs'
const dynamicRoutes = (data:any, parent = baseApiStr) => {
    for (let item of data) {
        //多级菜单
        
        if (item.children && item.children.length > 0) {
            router.addRoute(parent, {
                path: item.path,
                name: item.name,
                component: Layout,
                meta: {
                    parent,
                    ...item.meta,
                    pageData: item.meta && item.meta.pageData ? item.meta.pageData.length ? item.meta.pageData[0] : item.meta.pageData : {},
                    icon: getDynamicIcon(item.path),
                    // showAnchor: true,
                    auth: true
                }
            })
            dynamicRoutes(item.children, item.name)
        } else {  //一级菜单
            let route:any = {
                path: item.path,
                name: item.name,
                component: () => import(`@/views/${baseApiStr}/index.vue`),
                meta: {
                    parent,
                    ...item.meta,
                    icon: getDynamicIcon(item.path),
                    pageData: item.meta && item.meta.pageData ? item.meta.pageData.length ? item.meta.pageData[0] : item.meta.pageData : {},
                    // showAnchor: true,
                    auth: true
                }
            }
            if (item.path === `/${baseApiStr}/`) {
                route.redirect = '/error'
                route.meta.hideInMenu = true
            }
            router.addRoute(parent, route);
        }
    }
};
const fetchRouteData = (to:any, from:any, next: any) => {
    return new Promise((resolve, reject) => {
        let dyRoutes:any = []
        dyRoutes = storage.getItem('routes')
        if (dyRoutes && dyRoutes !== null && dyRoutes.length) {
            dynamicRoutes(dyRoutes)
            resolve(dyRoutes)
            return
        } else {
            dyRoutes = []
        }
        let loopRefs = ['DepartmentPurchaseCategoryOutputVO', 'WebsiteDepartmentCategoryOutputVO', 'WebsiteDepartmentCategoryOutputVO', 'DepartmentTreeOutputVO', 'DeptTreeVo', 'MenuTreeVo', '客户虚拟商品池查询条件', '分类加载VO', 'SupplierInfoPageVo', 'CategoryBaeInfoVo', 'CategoryTreeVo', 'VirtualGoodsCateVo', '军网重点商品分类树返回模型', '开票申请DTO(基于订单)', '财务系统售后订单查询条件', 'CheckFlashSaleGoodsExclusionOutputDTO']
        let apiUrl = ''
        if (storage.getItem('websiteConfig')) {
            apiUrl = storage.getItem('websiteConfig').apiUrl || ''
        }
        const handleRoutes = (res: { data: any; }, dyRoutes: any[]) => {
            let { tags, paths, definitions, host, info, basePath = '', components, openapi } = (res.data  || res) as any
            // console.log((res.data  || res), '(res.data  || res)');
            const getParameters = (obj:any) => {
                if (!obj || obj === null) return {}
                for (const k in obj) {
                    if (k === '$ref') {
                        for (const key in definitions) {
                            if (obj[k] && typeof obj[k] === 'string' && obj[k].split('/')[2] && key === obj[k].split('/')[2]) {
                                if (loopRefs.includes(key)) { // 剔除树结构，防止递归死循环
                                    obj[k] = ''
                                } else {
                                    obj[k] = getParameters(definitions[key])
                                }
                                let children:any = []
                                for (const key in obj[k].properties) {
                                    let child:any = obj[k].properties[key].items ? obj[k].properties[key].items.$ref : obj[k].properties[key].$ref ? obj[k].properties[key].$ref : obj[k].properties[key] || obj[k].properties || ''
                                    let o:any = {
                                        name: key,
                                        example: (obj[k].properties[key] && obj[k].properties[key]['example']) || child?.example || '',
                                        children: child,
                                        type: (obj[k].properties[key] && obj[k].properties[key]['type']) || child?.type || 'object',
                                        required: (obj[k].properties[key] && obj[k].properties[key]['required']) || child?.required || false,
                                        format:obj[k].properties[key]['format'],
                                        description: obj[k].properties[key]['description'],
                                    }
                                    children.push(o)
                                }
                                children.length && (obj[k] = children)
                            }
                        }
                    }
                    if (k === 'requestBody') {
                        let requestBody = (components && components.schemas) || {}
                        for (const key in requestBody) {
                            if (requestBody[key] && obj[k] && obj[k].content && obj[k].content['application/json'] && key === obj[k].content['application/json'].schema.$ref.split('/')[3]) {
                                let children:any = []
                                for (const j in requestBody[key].properties) {
                                    let temp = requestBody[key].properties[j]
                                    let child:any = temp?.items ? temp.items?.$ref : temp.$ref ? temp.$ref : temp || requestBody[key]?.properties[j] || ''
                                    let o:any = {
                                        name: j,
                                        example: temp?.example || child?.example || '',
                                        children: child,
                                        in: 'body',
                                        type: temp?.type || child?.type || 'array',
                                        required: temp?.required || child?.required || false,
                                        format: temp['format'],
                                        description: temp['description'],
                                    }
                                    children.push(o)
                                }
                                children.length && (obj['parameters'] = children)
                            }
                        }
                    }
                    if (typeof obj[k] === 'object' &&  obj[k] !== null && obj[k]) {
                        obj[k] = getParameters(obj[k])
                    }
                }
                return obj
            }
            if (tags && !tags.length) {
                for (const key in paths) {
                    tags.push(paths[key].post?.tags[0] || paths[key].get?.tags[0])
                }
                tags = [...new Set(tags)]
                tags = tags.map((el:any) => ({ name: el }))
            }
            tags?.map((el:any, index: number) => {
                let route:any = {
                    path: `/${baseApiStr}/`,
                    name: '',
                    component: baseApiStr,
                    meta: {
                        title: el.name?.replace(/接口/g, '') || '',
                        // icon: 'Menu',
                        pageData: []
                    }
                }
                for (const key in paths) {
                    let data = paths[key].post || paths[key].get || {}
                    if (data.tags.includes(el.name)) {
                        if (data.summary || data.description) {
                            route.meta.pageData.push({
                                data: { ...getParameters(data) },
                                url: key,
                                basePath,
                                component: baseApiStr,
                                name: data.summary?.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~@#￥%……&*（）——\-+={}|《》：【】、；'、]/g, '') || data.description,
                                host,
                                info,
                                method: paths[key].post ? 'post' : 'get'
                            })
                        }
                    }
                }
                route.name = route.meta.pageData[0]?.url.split('/').filter((el:string) => el && el !== baseApiStr).join('') || ''
                if (openapi) route.name = route.name || baseApiStr
                route.path += route.name || ''
                route.meta.showInHeader = false
                route.meta.hideInMenu = route.path === `/${baseApiStr}/`
                route.meta.icon = getDynamicIcon(route.name)
                if (route.meta.pageData.length >= 1) {
                    route.meta.showInHeader = route.meta.pageData.length > 1 && route.meta.pageData.length < 15
                    route.children = route.meta.pageData.map((val:any, idx: number) => {
                        let path:string = `/${baseApiStr}` + (val.url ? val.url : route.name)
                        return {
                            path,
                            name: baseApiStr + val.url?.split('/').join('') || '',
                            meta: {
                                title: val.name?.replace(/接口/g, '') || '',
                                // icon: 'Menu',
                                // icon: getDynamicIcon(path),
                                hideInMenu: path === `/${baseApiStr}/`,
                                pageData: val
                            }
                        }
                    })
                }
                dyRoutes.push(route)
            })
            // console.log(dyRoutes, 'dyRoutes')
            return dyRoutes
        }
        let excludeExtends = ['.json']
        if (!excludeExtends.find(el => apiUrl.includes(el))) apiUrl += '/v2/api-docs'
        if (import.meta.hot && !excludeExtends.find(el => apiUrl.includes(el))) {
            import.meta.hot.send('getRoutes', { url: apiUrl })
            import.meta.hot.on('getRoutes', (res) => {
                if (res) {
                    let routes = handleRoutes(res, dyRoutes)                    
                    dynamicRoutes(routes)
                    resolve(routes)
                } else {
                    resolve([])
                }
            })
        } else {
            axios.get(apiUrl, { params: { url: apiUrl } }).then((res:any) => {
                if (res) {
                    let routes = handleRoutes(res, dyRoutes)
                    dynamicRoutes(routes)
                    resolve(routes)
                } else {
                    resolve([])
                }
            }).catch((err) => {
                console.log(err, 'err')
                resolve([])
            })
        }
    })
}
export default fetchRouteData;