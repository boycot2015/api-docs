<template>
    <div class="api-docs-app" key="api-docs-app" v-loading="loading">
        <el-row>
            <el-col>
                <el-table :data="appList" style="width: 100%;">
                    <el-table-column
                    label="项目名称"
                    prop="name"
                    >
                        <template #default="{row}">
                            {{ row.name }}
                            <el-tag style="margin-left: 10px;" size="mini" v-if="row.replace">默认</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="项目路径"
                    prop="url"
                    ></el-table-column>
                    <el-table-column
                    label="操作"
                    width="100px"
                    >
                        <template #default="{row}">
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
import AddOrEdit from './addOrEdit.vue'
const emits = defineEmits(['update:modelValue'])
const { appConfig, setAppConfig } = useAppConfigStore()
interface AppProps {
    icon: string
    url: string
    name: string
    replace?:boolean
}
const appList = computed<AppProps[]>(() => appConfig.apiList)
const loading = ref(true)
const [ visible, toggleVisible ] = useState(false)
const rowData = ref({})
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
onMounted(() => {
    loading.value = false
})
</script>
<style lang="scss">
.api-docs-app {
    max-width: 100%;
}
</style>