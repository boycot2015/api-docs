import { createRouter, createWebHistory } from 'vue-router'
import config from '@/config'
import storage from '@/utils/storage'
import routes from './routes'
import dynamicRoutes from './dynamicRoutes'
import { useRouteStore } from '@/stores/app'
import Loading from '@/hooks/loading'
import { getValidRoute } from '@/utils'
import { npStart, npClose } from '@/plugins/nprogress'
interface RouteProps {
    path: string
    name: string
    meta: {
        realTitle?:string
        title: string
        icon?: string
        hideInMenu?:boolean
        hideChildren?:boolean
    }
    children?: RouteProps[]
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as any
})
router.beforeEach(async (to, from, next) => {
    if (to.path !== from.path) {
        npStart()
    }
    let dyRoutes:any = []
    let routeStore = useRouteStore()
    to.meta.websiteName = config.websiteName
    to.meta.websiteConfig = config
    document.title = (to.meta.title  ? to.meta.title + '-' : '') + config.websiteName
    if (!storage.getItem('websiteConfig')) {
        storage.setItem('websiteConfig', config)
    }
    if (routeStore.hasRoutes) {
        next()
    } else {
        Loading()
        dyRoutes = await dynamicRoutes(to, from, next)
        routeStore.setRoutes([...routes, ...dyRoutes], true)
        storage.setItem('routes', [...dyRoutes])
        // console.log(getValidRoute(dyRoutes).map((el:any) => el.path), to.path, 'getValidRoute');
        if (![...getValidRoute(routes).map((el:any) => el.path), ...getValidRoute(dyRoutes).map((el:any) => el.path)].includes(to.path)) {
            next({ path: '/', replace: true })
        } else {
            next({ ...to, replace: true })
        }
        Loading().close()
    }
})
router.afterEach(() => {
    // console.log(document.querySelectorAll('body .body'), '1231');
    npClose()
})
export type {
    RouteProps
}
export default router
