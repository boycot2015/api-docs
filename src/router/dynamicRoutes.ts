//处理树形数据
//dynamicRoutes.js
import config from '@/config'
import http from '@/api/request'
import router from './index';
import { RouterView } from "vue-router";
const modules = import.meta.glob('@/views/*/*.vue')
const dynamicRoutes = (data:any, parent = '') => {
    for (let item of data) {
        //多级菜单
        if (item.children && item.children.length > 0) {
            router.addRoute(parent, {
                path: item.path,
                name: item.name,
                component: RouterView,
                meta: {
                    ...item.meta,
                    auth: true
                }
            })
            // console.log(data, parent, router.getRoutes(), 'data');
            dynamicRoutes(item.children, item.name)
        } else {  //一级菜单
            router.addRoute(parent, {
                path: item.path,
                name: item.name,
                // component: () => modules[`@/views/apiDocs`],
                component: () => import( /* @vite-ignore */ '@/views/apiDocs.vue'),
                // component: item.component,
                meta: {
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
        // let hasRoutes = window.localStorage.getItem(config.websitePrefix + 'routes')
        // if (hasRoutes) {
        //     dyRoutes = JSON.parse(hasRoutes)
        //     dynamicRoutes(JSON.parse(hasRoutes))
        //     resolve(dyRoutes)
        // }
        // http://121.41.51.167:10001/v2/api-docs
        http.get('/', {}).then((res:any) => {
            // console.log(res, '1eqweqw');
            const { tags, paths, definitions } = res as any
            const getResponesparameters = (prop:string) => {
                let obj:any = {} 
                for (const key in definitions) {
                    if (key === prop) {
                        obj = definitions[key]
                    }
                }
                if (obj.properties && obj.properties.result && obj.properties.result.$ref) {
                    let $ref = obj.properties.result.$ref || ''
                    obj.properties.result = getResponesparameters($ref.split('/')[2])
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
                        // icon: 'Menu',
                        pageData: []
                    }
                }
                for (const key in paths) {
                    let data = paths[key].post || paths[key].get || {}
                    if (data.tags.includes(el.name)) {
                        let $ref = data.responses[200].schema.$ref || ''
                        let responesparameters = getResponesparameters($ref.split('/')[2])
                        console.log(responesparameters, 'obj');
                        route.meta.pageData.push({
                            data: { ...data, responesparameters },
                            // data,
                            url: key,
                            component: 'apiDocs',
                            name: data.summary,
                            method: paths[key].post ? 'post' : 'get'
                        })
                    }
                }
                route.name = route.meta.pageData[0].url.split('/').join('')
                route.path += route.name
                if (route.meta.pageData.length >= 1) {
                    route.children = route.meta.pageData.map((val:any, idx: number) => ({
                        path: '/apiDocs/' + route.name + '/' + val.url.split('/').join(''),
                        name: 'apiDocs' + val.url.split('/').join(''),
                        // component: 'apiDocs',
                        // component: () =>  import( /* @vite-ignore */ `@/views/apiDocs.vue`),
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