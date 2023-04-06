import { createRouter, createWebHistory } from 'vue-router'
import config from '@/config'
import routes from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from) => {
    to.meta.websiteName = config.websiteName
    to.meta.websiteConfig = config
    document.title = config.websiteName + '-' + to.meta.title
    
})
router.afterEach(() => {
    // console.log(document.querySelectorAll('body .body'), '1231');
})
export default router
