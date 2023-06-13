<template>
    <div class="api-docs-app" key="api-docs-app">
        <el-row>
            <el-col :span="24">
                <Upload
                    class="upload"
                    :show-file-list="false"
                    :multiple="true"
                    :drag="true"
                    :limit="10"
                    @on-success="handleSuccess"/>
            </el-col>
            <el-col>
                <el-form class="flexbox-h just-b" style="border-bottom: 1px solid #e8e8e8;margin-bottom: 16px;" inline>
                    <div class="flexbox-h just-b">
                        <el-form-item label="名称：">
                            <el-input v-model="formData.name" placeholder="请输入关键字"></el-input>
                        </el-form-item>
                    </div>
                    <div class="action">
                        <el-button type="primary" :loading="loading" @click="initData()">查询</el-button>
                        <el-button @click="reset">重置</el-button>
                    </div>
                </el-form>
            </el-col>
            <el-col class="btns mb16">
                <el-button :disabled="!selectList.length" @click="onDelete()">删除</el-button>
            </el-col>
            <el-col>
                <el-table
                :data="fileList"
                @selection-change="(val:any) => selectList = val"
                v-loading="loading"
                maxHeight="350px"
                style="width: 100%;">
                    <el-table-column prop="" type="selection"></el-table-column>
                    <el-table-column
                    label=""
                    width="100px">
                        <template #default="{row}">
                            <Image :compress="true" :preview-list="fileList.map((el:any) => el.origionUrl)" style="min-width:60px;width: auto;height: 60px;" :src="row.url" lazy></Image>
                            <!-- <img :src="row.url" alt=""> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="文件名称"
                    prop="name"
                    width="180px"
                    >
                        <template #default="{row}">
                            <div class="line-clamp2">{{ row.name }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="文件路径"
                    prop="url"
                    >
                        <template #default="{row}">
                            <div class="line-clamp2">{{ row.url }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="100px">
                        <template #default="{row}">
                            <el-link style="margin-right: 10px;" @click="onAdd(row)">编辑</el-link>
                            <el-link @click="onDelete(row)" :disabled="!row.canDelete">删除</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page clerfix mt16">
                    <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 100]"
                    small
                    class="fr"
                    :background="true"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    />
                </div>
            </el-col>
        </el-row>
        <AddOrEdit v-model="visible" :data="rowData" @on-submit="initData()"></AddOrEdit>
    </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import Loading from '@/hooks/loading'
import useState from '@/hooks/useState'
import AddOrEdit from './addOrEdit.vue'
import { apiUrl } from '@/api/baseUrl'
import http from '@/api/request'
import type { UploadProps } from 'element-plus'
interface AppProps {
    id: string
    url: string
    name: string
    replace?:boolean
}
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectList = ref([])
const formData = ref({
    name: ''
})
let fileList = ref<AppProps[]>([])
const loading = ref(true)
const [ visible, toggleVisible ] = useState(false)
const rowData = ref({})
const initData = () => {
    loading.value = true
    http.get(apiUrl + '/files', { params: { currentPage: currentPage.value,
        pageSize: pageSize.value, ...formData.value } } as any).then(res => {
        fileList.value = res.data.records as unknown as AppProps[]
        total.value = res.data.total as any
        loading.value = false
    })
}
const reset = () => {
    currentPage.value = 1
    formData.value = {
        name: ''
    }
    initData()
}
initData()
const onAdd = (row?:any) => {
    rowData.value = row || {}
    toggleVisible(true)
}
const onDelete = (row?: { id: any }) => {
    ElMessageBox.confirm('确认删除？', '温馨提示').then(() => {
        Loading({ text: '正在删除，请稍后...' })
        let ids = []
        if (row) {
            ids = [row?.id]
        } else {
            ids = selectList.value.map((el:AppProps) => el.id)
        }
        http.post(apiUrl + '/files/delete', { ids }).then((res: any) => {
            if (res.success) {
                ElMessage.success('删除成功')
                Loading().close()
                currentPage.value = 1
                initData()
            }
        })
    }).catch(() => {})
}
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
    initData()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    initData()
}


const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile, uploadFiles) => {
    //   console.log(response, fileList.value, 'response')
    ElMessage.success('操作成功')
    initData()
}
</script>
<style lang="scss">
.api-docs-app {
    // width: calc(100vw - 200px);
    max-width: 100%;
    .upload {
        height: 100px;
    }
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