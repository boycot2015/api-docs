import { ref, computed } from 'vue'
import config from '@/config'
import type { AppConfigProps } from '@/config'
import { defineStore } from 'pinia'
import storage from '@/utils/storage'

// 折叠菜单
export const useCollapseStore = defineStore('collapse', () => {
  const isCollapse = ref(false)
  function toggleCollapse(value?:boolean) {
    isCollapse.value = value !==undefined ? value: !isCollapse.value
  }
  return { isCollapse, toggleCollapse }
})
// 锚点
export const useAnchorStore = defineStore('anchor', () => {
    const anchors = ref([])
    const anchorIndex = ref(0)
    function setAnchor(val:any) {
      anchors.value = val
    }
    function setAnchorIndex(val:number) {
        anchorIndex.value = val
      }
    return { anchors, anchorIndex, setAnchor, setAnchorIndex }
})
// 动态路由
export const useRouteStore = defineStore('router', () => {
    let hasRoutes = ref(false)
    const routes = ref([])
    function setRoutes(list:any, exist:boolean) {
        routes.value = list
        hasRoutes.value = exist
    }
    return { routes, hasRoutes, setRoutes }
})
// 应用配置
export const useAppConfigStore = defineStore('appConfig', () => {
    let configs = storage.getItem('websiteConfig') || config
    
    const appConfig = ref(configs)
    function setAppConfig(val:AppConfigProps|any) {
        appConfig.value = { ...appConfig.value, ...val }
        storage.setItem('websiteConfig', { ...storage.getItem('websiteConfig'), ...val })
    }
    return { appConfig, setAppConfig }
})
// 应用集合
export const useAppsStore = defineStore('apps', () => {
    const apps = ref(storage.getItem('apps') || [])
    function setApps(val:any) {
        apps.value = val
        storage.setItem('apps', val)
    }
    return { apps, setApps }
})
