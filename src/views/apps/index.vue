<template>
    <div class="api-docs-app" key="api-docs-app" v-loading="loading">
      <el-row class="list clearfix">
          <el-col :span="3" class="list-item fl" v-for="app in appList" :key="app.name">
              <div class="icon" @click="onAdd(app)">
                  <el-icon v-if="app.icon">
                      <component :is="app.icon"></component>
                  </el-icon>
                  <span v-else>
                    <template v-if="app.url.split('/')[1]">
                        {{ app.url.split('/')[1][0]?.toUpperCase() }}
                    </template>
                    <template v-else>{{ app.name[0]?.toUpperCase() }}</template>
                  </span>
              </div>
              <div class="name">{{ app.name }}</div>
          </el-col>
          <div class="list-item fl">
              <div class="icon" @click="onAdd()">
                  <el-icon>
                      <Plus />
                  </el-icon>
              </div>
              <div class="name">新增项目</div>
          </div>
      </el-row>
      <div class="export-btn">
            <el-button size="small" type="primary" @click="onExport">导出数据</el-button>
      </div>
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
    width: 100%;
    .list {
        padding: 15px;
        &-item {
            margin-right: 20px;
            text-align: center;
            .icon {
                cursor: pointer;
                background-color: var(--vt-c-white-soft);
                color: #333;
                padding: 15px;
                width: 60px;
                height: 60px;
                line-height: 60px;
                font-size: 32px;
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
                max-width: 100px;
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