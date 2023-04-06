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
