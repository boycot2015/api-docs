<script setup lang="tsx">
import { useAnchorStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import ApiDesc from './components/desc.vue'
import ApiParameters from './components/parameters.vue'
import ApiResponse from './components/response.vue'

const router = useRouter()
const appPageAnchors = useAnchorStore()
const loading = ref(true)
const pageData:any = computed(() => router.currentRoute.value.meta?.pageData)
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
    <el-row>
        <el-col><ApiDesc /></el-col>
        <el-col><ApiParameters /></el-col>
        <el-col><ApiResponse /></el-col>
    </el-row>
    <!-- <ApiDesc></ApiDesc>
    <ApiParameters></ApiParameters>
    <ApiResponse></ApiResponse> -->
  </div>
</template>
<style lang="scss">
.api-docs {
    padding: 30px 0;
    z-index: 2;
    max-width: 100%;
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
            border-bottom: 1px solid var(--vt-c-white-mute);
            &-item {
                padding-left: 15px;
                position: relative;
                margin-bottom: 10px;
                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-4px);
                    width: 8px;
                    height: 8px;
                    background-color: #ccc;
                }
            }
        }
        .api-desc-item {
            .name {
                margin-left: 20px;
            }
            .value {
                padding: 5px 10px;
                // background-color: var(--vt-c-white-soft);
                margin: 0 0 10px 30px;
            }
        }
    }
}
</style>