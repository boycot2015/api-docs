<script setup lang="tsx">
import { useRouteStore } from '@/stores/app'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getVaildRoute } from '@/utils'
let routeStore = useRouteStore()
interface LinkItem {
  name: string
  value: string
  path: string
}
const routes:any = computed(() => routeStore.routes)
const router = useRouter()
const loading = ref(true)
const pageData:any = computed(() => router.currentRoute.value.meta?.pageData)
watch(pageData, (val) => {})
const keyword = ref('')
const suggestions = ref<LinkItem[]>(getVaildRoute(routes.value.filter((el:any) => el.meta?.showInHeader)))
const querySearch = (key:string, cb: (params:any) => void) => {
    const results = key ? getVaildRoute(routes.value.filter((el:any) => !el.meta?.hideInSearch)).filter(createFilter(key)) : suggestions.value
    cb(results)
}
const createFilter = (queryString:string) => {
  return (restaurant:any) => {
    return (
      restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    )
  }
}
const handleSelect = (item: LinkItem) => {
//   console.log(item)
  router.push(item.path)
}
onMounted(() => {
    loading.value = false
})
</script>
<template>
  <div class="api-docs-search" key="api-docs-search" v-loading="loading">
    <el-autocomplete v-model="keyword"
    :fetch-suggestions="querySearch"
    @select="handleSelect"
    style="width: 100%;"
    clearable
    placeholder="请输入关键字/接口路径"></el-autocomplete>
  </div>
</template>
<style lang="scss">
.api-docs-search {
    width: 320px;
}
</style>