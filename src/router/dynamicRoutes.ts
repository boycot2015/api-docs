//处理树形数据
//dynamicRoutes.js
import config from '@/config'
import axios from '@/api/request'
import router from './index';
import Layout from '@/layout/index.vue'
import storage from '@/utils/storage'
const dynamicRoutes = (data:any, parent = '') => {
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
            router.addRoute(parent, {
                path: item.path,
                name: item.name,
                component: () => import( /* @vite-ignore */ '@/views/apiDocs/index.vue'),
                meta: {
                    parent,
                    // showInHeader: true,
                    ...item.meta,
                    auth: true
                }
            });
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
        // http://121.41.51.167:10001/v2/api-docs
        
        axios.get('/v2/api-docs', {}).then((res:any) => {
            // console.log(res);
            const { tags, paths, definitions, host, info } = res as any
            const getParameters = (obj:any) => {
                if (!obj || obj === null) return {}
                for (const k in obj) {
                    if (k === '$ref') {
                        for (const key in definitions) {
                            if (obj[k] && typeof obj[k] === 'string' && obj[k].split('/')[2] && key === obj[k].split('/')[2]) {
                                obj[k] = getParameters(definitions[key])
                                let children:any = []
                                for (const key in obj[k].properties) {
                                    let child:any = obj[k].properties[key].items ? obj[k].properties[key].items.$ref : obj[k].properties[key].$ref ? obj[k].properties[key].$ref : ''
                                    let o:any = {
                                        // in: 'body',
                                        name: key,
                                        example: (obj[k].properties[key] && obj[k].properties[key]['example']) || child?.example || '',
                                        children: child,
                                        type: (obj[k].properties[key] && obj[k].properties[key]['type']) || child?.type || 'object',
                                        required: (obj[k].properties[key] && obj[k].properties[key]['required']) || child?.required || false,
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
            tags.map((el:any, index: number) => {
                let route:any = {
                    path: '/apiDocs/',
                    name: '',
                    component: 'apiDocs',
                    meta: {
                        title: el.name.replace(/接口/g, ''),
                        icon: 'Menu',
                        showInHeader: el.name.length < 13,
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
                            component: 'apiDocs',
                            name: data.summary,
                            host,
                            info,
                            method: paths[key].post ? 'post' : 'get'
                        })
                    }
                }
                route.name = route.meta.pageData[0]?.url.split('/').join('')|| 'apiDocs'
                route.path += route.name || ''
                if (route.meta.pageData.length >= 1) {
                    route.children = route.meta.pageData.map((val:any, idx: number) => ({
                        path: '/apiDocs/' + route.name + val.url ? '/' + val.url.split('/').join('') : 'index',
                        name: 'apiDocs' + val.url?.split('/').join('') || '',
                        meta: {
                            title: val.name.replace(/接口/g, ''),
                            icon: 'Menu',
                            pageData: val
                        }
                    }))
                }
                dyRoutes.push(route)
            })
            dynamicRoutes(dyRoutes)
            // console.log(router.getRoutes(), 'hasRoutes');
            resolve(dyRoutes)
        })
    })
}
export default fetchRouteData;