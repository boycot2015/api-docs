//处理树形数据
//dynamicRoutes.js
import axios from '@/api/request'
import router from './index';
import Layout from '@/layout/index.vue'
import storage from '@/utils/storage'
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
                    auth: true
                }
            })
            dynamicRoutes(item.children, item.name)
        } else {  //一级菜单
            let route:any = {
                path: item.path,
                name: item.name,
                component: () => import( /* @vite-ignore */ `@/views/${baseApiStr}/index.vue`),
                meta: {
                    parent,
                    ...item.meta,
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
        if (dyRoutes && dyRoutes !== null) {
            dynamicRoutes(dyRoutes)
            resolve(dyRoutes)
            return
        } else {
            dyRoutes = []
        }
        let loopRefs = ['DepartmentPurchaseCategoryOutputVO', 'WebsiteDepartmentCategoryOutputVO', 'WebsiteDepartmentCategoryOutputVO', 'DepartmentTreeOutputVO']
        // http://121.41.51.167:10001/v2/api-docs
        let baseUrl = ''
        if (storage.getItem('websiteConfig')) {
            baseUrl = storage.getItem('websiteConfig').apiUrl || ''
        }
        axios.get(baseUrl + '/v2/api-docs', {}).then((res:any) => {
            // console.log(res);
            if (res) {
                const { tags, paths, definitions, host, info } = res as any
                const getParameters = (obj:any) => {
                    if (!obj || obj === null) return {}
                    for (const k in obj) {
                        if (k === '$ref') {
                            for (const key in definitions) {
                                if (obj[k] && typeof obj[k] === 'string' && obj[k].split('/')[2] && key === obj[k].split('/')[2]) {
                                    loopStr = obj[k]
                                    if (loopRefs.includes(key)) { // 剔除树结构，防止递归死循环
                                        obj[k] = ''
                                    } else {
                                        obj[k] = getParameters(definitions[key])
                                    }
                                    let children:any = []
                                    for (const key in obj[k].properties) {
                                        let child:any = obj[k].properties[key].items ? obj[k].properties[key].items.$ref : obj[k].properties[key].$ref ? obj[k].properties[key].$ref : obj[k].properties[key] || obj[k].properties || ''
                                        let o:any = {
                                            // in: 'body',
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
                        if (typeof obj[k] === 'object' &&  obj[k] !== null && obj[k]) {
                            obj[k] = getParameters(obj[k])
                        }
                    }
                    return obj
                }
                let loopStr = ''
                tags.map((el:any, index: number) => {
                    let route:any = {
                        path: `/${baseApiStr}/`,
                        name: '',
                        component: baseApiStr,
                        meta: {
                            title: el.name.replace(/接口/g, ''),
                            // icon: 'Menu',
                            pageData: []
                        }
                    }
                    for (const key in paths) {
                        let data = paths[key].post || paths[key].get || {}
                        if (data.tags.includes(el.name)) {
                            // console.log({ ...getParameters(data) }, 'obj');
                            route.meta.pageData.push({
                                data: { ...getParameters(data) },
                                url: key,
                                component: baseApiStr,
                                name: data.summary.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g, ''),
                                host,
                                info,
                                method: paths[key].post ? 'post' : 'get'
                            })
                        }
                    }
                    route.name = route.meta.pageData[0]?.url.split('/').join('') || ''
                    route.path += route.name || ''
                    route.meta.showInHeader = false
                    route.meta.hideInMenu = route.path === `/${baseApiStr}/`
                    if (route.meta.pageData.length >= 1) {
                        route.meta.showInHeader = route.meta.pageData.length > 2
                        route.children = route.meta.pageData.map((val:any, idx: number) => {
                            let path:string = `/${baseApiStr}/` + (route.name + (val.url ? '/' + val.url.split('/').join('') : ''))
                            return {
                                path,
                                name: baseApiStr + val.url?.split('/').join('') || '',
                                meta: {
                                    title: val.name.replace(/接口/g, ''),
                                    // icon: 'Menu',
                                    hideInMenu: path === `/${baseApiStr}/`,
                                    pageData: val
                                }
                            }
                        })
                    }
                    dyRoutes.push(route)
                })
                dynamicRoutes(dyRoutes)
                // console.log(router.getRoutes(), 'hasRoutes');
                resolve(dyRoutes)
            } else {
                resolve([])
            }
        })
    })
}
export default fetchRouteData;