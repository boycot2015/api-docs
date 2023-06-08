<template>
    <div class="api-docs-app" key="api-docs-app" v-loading="loading">
        <el-row>
            <el-col :span="24">
                <Upload
                    class="upload mb16"
                    :show-file-list="false"
                    multiple
                    :drag="true"
                    :limit="10"
                    :on-success="handleSuccess"/>
            </el-col>
            <el-col>
                <el-table :data="appList" maxHeight="340px" style="width: 100%;">
                    <el-table-column
                    label=""
                    width="100px">
                        <template #default="{row}">
                            <el-image style="width: 100px;height: auto;" :src="row.url" lazy></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="文件名称"
                    prop="name"
                    width="180px"
                    ></el-table-column>
                    <el-table-column
                    label="文件路径"
                    prop="url"
                    ></el-table-column>
                    <el-table-column
                    label="操作"
                    width="100px">
                        <template #default="{row}">
                            <!-- {{ row }} -->
                            <el-link style="margin-right: 10px;" @click="onAdd(row)">编辑</el-link>
                            <el-link @click="onDelete(row)">删除</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page clerfix mt16">
                    <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[100, 200, 300, 400]"
                    small
                    class="fr"
                    :background="true"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    />
                </div>
            </el-col>
        </el-row>
        <AddOrEdit v-model="visible" :data="rowData"></AddOrEdit>
    </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppConfigStore } from '@/stores/app'
import storage from '@/utils/storage'
import Loading from '@/hooks/loading'
import { downloadFile } from '@/utils'
import useState from '@/hooks/useState'
import { useRouter } from 'vue-router'
import AddOrEdit from './addOrEdit.vue'
import { apiUrl } from '@/api/baseUrl'
import http from '@/api/request'
import type { UploadProps, UploadUserFile } from 'element-plus'
const emits = defineEmits(['update:modelValue'])
const currentPage = ref(1)
const pageSize  = ref(10)
const {appConfig, setAppConfig } = useAppConfigStore()
interface AppProps {
    icon: string
    url: string
    name: string
    replace?:boolean
}
let appList = ref<AppProps[]>(appConfig.apiList)
const router = useRouter()
const loading = ref(true)
const [ visible, toggleVisible ] = useState(false)
const rowData = ref({})
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const initData = (name?:string) => {
    http.get(apiUrl + '/files', { name } as any).then(res => {
        console.log(res.data, '123');
        appList.value = res.data as unknown as AppProps[]
    })
}
initData()
const onAdd = (row?:any) => {
    rowData.value = row || {}
    toggleVisible(true)
}
const onDelete = (row: { id: any }) => {
    ElMessageBox.confirm('确认删除？', '温馨提示').then(() => {
        Loading({ text: '正在删除，请稍后...' })
        setTimeout(() => {
            let index = appList.value.findIndex((el:any) => el.id === row.id)
            appList.value.splice(index, 1)
            setAppConfig({ apiList: appList.value })
            emits('update:modelValue', false)
            ElMessage.success('删除成功')
            Loading().close()
        }, 200);
    }).catch(() => {})
}
const handleSizeChange = () => {}
const handleCurrentChange = () => {}
onMounted(() => {
    loading.value = false
})


const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile, uploadFiles) => {
    //   console.log(response, fileList.value, 'response')
    ElMessage.success('操作成功')
}
</script>
<style lang="scss">
.api-docs-app {
    // width: calc(100vw - 200px);
    max-width: 100%;
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