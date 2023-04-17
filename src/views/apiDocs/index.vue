<script setup lang="tsx">
import { useAnchorStore } from '@/stores/app'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import ApiDesc from './components/desc.vue'
import ApiParameters from './components/parameters.vue'
import ApiResponse from './components/response.vue'

const router = useRouter()
const appPageAnchors = useAnchorStore()
const loading = ref(true)
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
watch(pageData, (val) => {
    if (!val) return
    setTimeout(() => {
        loading.value = false
        document.querySelectorAll!==null && appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
    }, 200);
})
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
    loading.value = false
})
</script>
<template>
  <div class="api-docs" :key="pageData.url" v-loading="loading">
    <ApiDesc></ApiDesc>
    <ApiParameters></ApiParameters>
    <ApiResponse></ApiResponse>
  </div>
</template>
<style lang="scss">
.api-docs {
    padding: 30px 0;
    z-index: 2;
    .title {
        font-size: 32px;
        // font-weight: bold;
        line-height: 32px;
        margin-bottom: 30px;
    }
    &-section {
        margin-bottom: 30px;
        .sub-title {
            margin: 0 0 15px;
            padding-bottom: 5px;
            padding-left: 15px;
            position: relative;
            border-bottom: 1px solid var(--vt-c-white-mute);
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-6px);
                width: 8px;
                height: 8px;
                background-color: #ccc;
            }
        }
        .api-desc-item {
            .name {
                margin-left: 20px;
            }
            .value {
                padding: 5px 10px;
                // background-color: var(--vt-c-white-soft);
                margin: 10px 0 10px 30px;
            }
        }
        pre {
            padding: 10px ;
            overflow: auto;
            max-height: 600px;
            border-radius: var(--border-radius);
            background-color: var(--vt-c-white-soft);
            color: var(--vt-c-black);
        }
    .top {
        position: --webkit-sticky;
        position: sticky;
        z-index: 9;
        top: -16px;
        padding-top: 10px;
        background-color: var(--vt-c-white);
    }
    }
}
</style>