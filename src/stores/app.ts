import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCollapseStore = defineStore('collapse', () => {
  const isCollapse = ref(false)
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }
  return { isCollapse, toggleCollapse }
})

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

export const useRouteStore = defineStore('router', () => {
    let hasRoutes = ref(false)
    const routes = ref([])
    function setRoutes(list:any, exist:boolean) {
        routes.value = list
        hasRoutes.value = exist
    }
    return { routes, hasRoutes, setRoutes }
})
