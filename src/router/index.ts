import { createRouter, createWebHistory, RouterView } from 'vue-router'
import config from '@/config'
import routes from './routes'
import dynamicRoutes from './dynamicRoutes'
import { useRouteStore } from '@/stores/app'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as any
})
// if (!router.hasRoute('apiDocs')) {
//     router.addRoute({
//         path: window.location.pathname,
//         name: 'apiDocs',
//         component: () => import( /* @vite-ignore */ '@/views/home.vue')
//     })
// }
router.beforeEach(async (to:any, from, next) => {
    let dyRoutes:any = []
    let routeStore = useRouteStore()
    to.meta.websiteName = config.websiteName
    to.meta.websiteConfig = config
    document.title = config.websiteName + '-' + to.meta.title
    if (routeStore.hasRoutes) {
        // console.log(router.getRoutes(), 'getRoutes');
        next()
    } else {
        // 增加以下代码，判断是否存在临时路由，存在则删除
        if (router.hasRoute('apiDocs')) {
            router.removeRoute('apiDocs')
        }
        dyRoutes = await dynamicRoutes(to, from, next)
        routeStore.setRoutes([...routes, ...dyRoutes], true)
        window.localStorage.setItem(config.websitePrefix + 'routes', JSON.stringify([...dyRoutes]))
        next({ ...to, replace: true })
    }
})
router.afterEach(() => {
    // console.log(document.querySelectorAll('body .body'), '1231');
})
export default router
