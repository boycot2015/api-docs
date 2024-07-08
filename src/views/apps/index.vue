<template>
    <div class="api-docs-app" key="api-docs-app" v-loading="loading">
        <el-row class="list" :gutter="30">
            <el-col :span="24" class="mb16">
                <div class="flexbox-h just-b">
                    <el-button class="icon-button" type="primary" style="margin-bottom: 10px;" @click="onAdd()">
                        <el-icon :size="18">
                          <IconifyIcon :name="'ep:plus'" color="var(--el-primary-color)" :icon-style="{fontSize: 18}" />
                        </el-icon>
                        新增项目
                    </el-button>
                    <div class="right flexbox-h align-c tr">
                        <el-button size="" class="mr16" @click="onExport">导出数据</el-button>
                        <el-radio-group v-model="viewType">
                            <el-radio-button :label="1">网格</el-radio-button>
                            <el-radio-button :label="2">列表</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
            </el-col>
            <el-col
            :span="8"
            v-show="viewType===1"
            :sm="{ span: 6 }"
            :md="{ span: 4 }"
            :xl="{ span: 3 }"
            class="list-item"
            :class="{ 'is-active' : app.replace }"
            v-for="app in appList" :key="app.name">
                <div class="icon" @click="onAdd(app)">
                        <el-icon :size="50">
                            <IconifyIcon :name="app.icon || 'ep:menu'" color="var(--el-primary-color)" :icon-style="{fontSize: 50}" />
                        </el-icon>
                </div>
                <div class="name">{{ app.name }}</div>
            </el-col>
            <!-- <el-col
            :span="8"
            v-show="viewType===1"
            :sm="{ span: 6 }"
            :md="{ span: 4 }"
            :xl="{ span: 3 }">
                <div class="list-item">
                    <div class="icon" @click="onAdd()">
                        <el-icon :size="30">
                            <IconifyIcon :name="'ep:plus'" color="var(--el-primary-color)" :icon-style="{fontSize: 30}" />
                        </el-icon>
                    </div>
                    <div class="name">新增项目</div>
                </div>
            </el-col> -->
            <el-col v-show="viewType===2">
                <ListView></ListView>
            </el-col>
        </el-row>
      <AddOrEdit v-model="visible" :data="rowData"></AddOrEdit>
    </div>
</template>
<script setup lang="ts">
import { useAppConfigStore } from '@/stores/app'
import storage from '@/utils/storage'
import { downloadFile } from '@/utils'
import useState from '@/hooks/useState'
import { useRouter } from 'vue-router'
import AddOrEdit from './addOrEdit.vue'
import ListView from './list.vue'
const {appConfig, setAppConfig } = useAppConfigStore()
interface AppProps {
    icon: string
    url: string
    name: string
    replace?:boolean
}
const appList = computed<AppProps[]>(() => appConfig.apiList)
const router = useRouter()
const loading = ref(true)
const [ visible, toggleVisible ] = useState(false)
const [ viewType, toggleViewType ] = useState(2)
const rowData = ref({})
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const onAdd = (row?:any) => {
    rowData.value = row || {}
    toggleVisible(true)
}
const onExport = () => {
    let data = storage.getItem('websiteConfig').apiList || {}
    downloadFile(data, 'app-list', 'json')
}
watch(pageData, (val) => {})
onMounted(() => {
    loading.value = false
})
</script>
<style lang="scss" scoped>
.api-docs-app {
    width: calc(100vw - 200px);
    .list {
        &-item {
            margin: 0 15px 10px;
            padding: 10px 0;
            text-align: center;
            margin-bottom: 20px;
            border-radius: var(--border-radius);
            border: 1px solid var(--vt-c-ccc);
            box-shadow: 0 0px 10px var(--vt-c-ccc);
            background-color: var(--vt-c-white-soft);
            overflow: hidden;
            transition: all .3s;
            cursor: pointer;
            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 20px var(--vt-c-ccc);
            }
            .icon {
                color: #333;
                padding: 15px;
                // width: 60px;
                // height: 60px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-bottom: 10px;
            }
            &.is-active {
                position: relative;
                &::after {
                    position: absolute;
                    right: 0;
                    top: 0;
                    content: '默认';
                    padding: 3px;
                    font-size: 12px;
                    border-radius: 0 0 0 var(--border-radius);
                    background-color: var(--el-color-primary);
                    color: var(--vt-c-white);
                }
            }
        }
    }
}
</style>