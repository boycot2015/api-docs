<script setup lang="tsx">
import { useRouter } from 'vue-router'
import useState from '@/hooks/useState'
import { useAppConfigStore } from '@/stores/app'
const appConfigStore = useAppConfigStore()
const router = useRouter()
const loading = ref(false)
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const appConfig:any = computed(() => appConfigStore.appConfig)
const [ state, setState ] = useState({
    loading: false,
    data: pageData.value.data,
    url: pageData.value.url,
    method: pageData.value.method || 'get',
    name: pageData.value.name
})
const urlObj:any = new URL(appConfig.value?.apiUrl)

watch(pageData, (val) => {
    if (!val) return
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 100)
    setState({
        ...state.value,
        data: val.data || {},
        url: val.url,
        method: val.method,
        name: val.name
    })
})
</script>
<template>
  <div class="api-docs-desc"  v-loading="loading">
    <h1 class="tc title" :class="{'font22': state.name?.length > 40}">{{state.name}}</h1>
    <div class="api-docs-section api-desc">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor0">1. 接口说明</h3>
        <div class="api-desc-item">
            <!-- {{pageData.info}} -->
            <div class="name sub-title-item">1.1 接口请求地址</div>
            <div class="value" v-highlight>【{{state.method}}】{{ urlObj.origin || '' }}{{appConfig.baseUrl || (pageData.basePath === '/' ? '': pageData.basePath)}}{{state.url}}</div>
        </div>
        <div class="api-desc-item">
            <div class="name sub-title-item">1.2 请求类型</div>
            <div class="value">{{state.data?.consumes?.join(',')||'application/json, text/plain, */*'}}</div>
        </div>
        <div class="api-desc-item">
            <div class="name sub-title-item">1.3 响应类型</div>
            <div class="value">{{state.data?.produces?.join(',')}}</div>
        </div>
        <div class="api-desc-item">
            <div class="name sub-title-item">1.4 接口描述</div>
            <div class="value">{{state.data?.description}}</div>
        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.font22 {
    font-size: 22px;
}
</style>