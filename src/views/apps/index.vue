<template>
    <div class="api-docs-app" key="api-docs-app" v-loading="loading">
      <el-row class="list" :gutter="30">
          <el-col
          :span="8"
          :sm="{ span: 6 }"
          :md="{ span: 4 }"
          :xl="{ span: 3 }"
          class="list-item"
          :class="{ 'is-active' : app.replace }"
          v-for="app in appList" :key="app.name">
              <div class="icon" @click="onAdd(app)">
                    <el-icon :size="30">
                        <IconifyIcon :name="app.icon || 'ep:menu'" color="var(--el-primary-color)" :icon-style="{fontSize: 30}" />
                    </el-icon>
              </div>
              <div class="name">{{ app.name }}</div>
          </el-col>
          <el-col
          :span="8"
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
          </el-col>
      </el-row>
      <!-- <div class="export-btn">
            <el-button size="" type="primary" @click="onExport">导出数据</el-button>
      </div> -->
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
<style lang="scss">
.api-docs-app {
    width: calc(100vw - 200px);
    .list {
        // margin-top: 30px;
        &-item {
            text-align: center;
            margin-bottom: 20px;
            .icon {
                cursor: pointer;
                background-color: var(--vt-c-white-soft);
                color: #333;
                padding: 15px;
                width: 60px;
                height: 60px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border-radius: var(--border-radius);
                border: 1px solid var(--vt-c-ccc);
                box-shadow: 0 0px 10px var(--vt-c-ccc);
                margin-bottom: 10px;
                transition: all .3s;
                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 20px var(--vt-c-ccc);
                }
            }
            .name {
                // max-width: 100px;
            }
            &.is-active {
                .icon {
                    background-color: var(--el-color-primary);
                    color: var(--vt-c-white);
                }
                .name {
                    color: var(--el-color-primary);
                }
            }
        }
    }
    .export-btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }
}
</style>