import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import ElementPlus from 'element-plus'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import 'element-plus/theme-chalk/dark/css-vars.css'
import directives from '@/directive'
import { createPinia } from 'pinia' // store

import highlight from '@/plugins/highlight.js' //代码高亮

const app = createApp(App)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
for (const [key, directive] of Object.entries(directives)) {
  app.directive(key, directive)
}
app.use(highlight)
app.use(createPinia())
app.use(router)
// app.use(ElementPlus, { size: 'default', zIndex: 3000, locale: zhCn })
app.mount('#app-docs')
