<template>
    <div class="api-docs-app" key="api-docs-app" v-loading="loading">
        <el-row>
            <el-col>
                <el-table :data="appList" style="width: 100%;">
                    <el-table-column
                    label="项目名称"
                    prop="name"
                    ></el-table-column>
                    <el-table-column
                    label="项目路径"
                    prop="url"
                    ></el-table-column>
                    <el-table-column
                    label="操作"
                    fixed="right"
                    width="100px"
                    >
                    <template #default="{row}">
                        <!-- {{ row }} -->
                        <el-link style="margin-right: 10px;" @click="onAdd(row)">编辑</el-link>
                        <el-link @click="onDelete(row)">删除</el-link>
                    </template>
                </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <AddOrEdit v-model="visible" :data="rowData"></AddOrEdit>
    </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppConfigStore } from '@/stores/app'
import Loading from '@/hooks/loading'
import useState from '@/hooks/useState'
import { useRouter } from 'vue-router'
import AddOrEdit from './addOrEdit.vue'
const emits = defineEmits(['update:modelValue'])
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
    }).catch(() => {
    })
}
watch(pageData, (val) => {})
onMounted(() => {
    loading.value = false
})
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