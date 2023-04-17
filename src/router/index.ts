import { createRouter, createWebHistory, RouterView } from 'vue-router'
import config from '@/config'
import routes from './routes'
import dynamicRoutes from './dynamicRoutes'
import { useRouteStore } from '@/stores/app'
import Loading from '@/hooks/loading'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as any
})
router.beforeEach(async (to:any, from, next) => {
    let dyRoutes:any = []
    let routeStore = useRouteStore()
    to.meta.websiteName = config.websiteName
    to.meta.websiteConfig = config
    document.title = config.websiteName + '-' + to.meta.title
    if (routeStore.hasRoutes) {
        next()
        // if (routeStore.routes.map((el:any) => el.path).includes(to.path)) {
        //     next()
        // } else {
        //     next({ name: 'error' })
        // }
    } else {
        Loading()
        dyRoutes = await dynamicRoutes(to, from, next)
        Loading().close()
        routeStore.setRoutes([...routes, ...dyRoutes], true)
        window.localStorage.setItem(config.websitePrefix + 'routes', JSON.stringify([...dyRoutes]))
        next({ ...to, replace: true })
    }
})
router.afterEach(() => {
    // console.log(document.querySelectorAll('body .body'), '1231');
})
export default router
