<script setup lang="tsx">
import { useAppConfigStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import Loading from '@/hooks/loading'
import storage from '@/utils/storage'
import { ElMessage } from 'element-plus'
const {appConfig, setAppConfig } = useAppConfigStore()
const appList = computed(() => appConfig.apiList)
const router = useRouter()
const loading = ref(true)
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const onClick = (item:any) => {
    setAppConfig({ apiUrl: item.url })
    onReload(item)
}
const onReload = (item:any) => {
    if (item.url !== appConfig.apiUrl) {
        Loading({ text: '正在切换接口数据，请稍后...' })
        storage.removeItem('routes')
        if (router.currentRoute.value.path !== '/') {
            window.location.reload()
        } else {
            window.location.href = '/'
        }
        Loading().close()
    } else {
        Loading({ text: '正在保存设置，请稍后...' })
        setTimeout(() => {
        Loading().close()
            ElMessage.success('保存成功')
        }, 500);
    }
}
watch(pageData, (val) => {})
onMounted(() => {
    loading.value = false
})
</script>
<template>
  <div class="api-docs-app" key="api-docs-app" v-loading="loading">
    <div class="list clearfix">
        <div class="list-item fl" @click="onClick(app)" v-for="app in appList" :key="app.name">
            <div class="icon">
                <el-icon v-if="app.icon">
                    <component :is="app.icon"></component>
                </el-icon>
                <span v-else>{{ app.url.split('/')[1][0].toUpperCase() }}</span>
            </div>
            <div class="name">{{ app.name }}</div>
        </div>
    </div>
  </div>
</template>
<style lang="scss">
.api-docs-app {
    .list {
        &-item {
            margin-right: 20px;
            cursor: pointer;
            &:nth-child(4n) {
                margin-right: 0;
            }
            .icon {
                text-align: center;
                background-color: #f8f8f8;
                color: #333;
                padding: 15px;
                border-radius: var(--border-radius);
                box-shadow: 0 0 10px #ccc;
                margin-bottom: 10px;
            }
        }
    }
}
</style>