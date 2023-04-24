import { createRouter, createWebHistory, RouterView } from 'vue-router'
import config from '@/config'
import storage from '@/utils/storage'
import routes from './routes'
import dynamicRoutes from './dynamicRoutes'
import { useRouteStore } from '@/stores/app'
import Loading from '@/hooks/loading'
import { getVaildRoute } from '@/utils'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as any
})
router.beforeEach(async (to:any, from, next) => {
    let dyRoutes:any = []
    let routeStore = useRouteStore()
    to.meta.websiteName = config.websiteName
    to.meta.websiteConfig = config
    document.title = to.meta.title  + '-' + config.websiteName
    if (!storage.getItem('websiteConfig')) {
        storage.setItem('websiteConfig', config)
    }
    if (routeStore.hasRoutes) {
        next()
    } else {
        Loading()
        dyRoutes = await dynamicRoutes(to, from, next)
        Loading().close()
        routeStore.setRoutes([...routes, ...dyRoutes], true)
        storage.setItem('routes', [...dyRoutes])
        // console.log(getVaildRoute(dyRoutes).map((el:any) => el.path), to.path, 'getVaildRoute');
        if (![...getVaildRoute(routes).map((el:any) => el.path), ...getVaildRoute(dyRoutes).map((el:any) => el.path)].includes(to.path)) {
            next({ path: '/', replace: true })
        } else {
            next({ ...to, replace: true })
        }
    }
})
router.afterEach(() => {
    // console.log(document.querySelectorAll('body .body'), '1231');
})
export default router
