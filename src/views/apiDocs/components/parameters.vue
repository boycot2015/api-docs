<script setup lang="tsx">
import { computed, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Column, SpanMethodProps } from '../tools'
import { getParams } from '../tools'
import useState from '@/hooks/useState'
import { getRowSpan } from '@/utils'
const router = useRouter()
const loading = ref(false)
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const inColumns:Column[] = [
    { prop: 'in', span: true, label: '传递位置', width: 150 },
    { prop: 'name', label: '参数名称', width: 200 },
    { prop: 'type', label: '类型', width: 100 },
    { prop: 'required', label: '是否必传', width: 100 },
    { prop: 'description', label: '说明', width: 180 },
]
const outColumns:Column[] = [
    { prop: 'name', label: '参数名称', width: 300 },
    { prop: 'type', label: '类型', width: 130 },
    { prop: 'required', label: '是否必传', width: 130 },
    { prop: 'description', label: '说明', width: 180 },
]
const [ state, setstate ] = useState({
    loading: false,
    data: pageData.value.data,
    inData: getParams(pageData.value.data.parameters),
    outData: getParams(pageData.value.data.responses[200].schema.$ref),
    inColumns,
    outColumns
})

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps, data:any) => {
    // console.log(row, 'data');
    let property = column.property
    let spans:any = state.value.inColumns.filter((el:any) => el.span)
    spans = spans.map((el:any) => el.prop).join(',')
    if (row.child) return {
        rowspan: 1,
        colspan: 1
    }
    if (spans.includes(property)) {
        let _row = (getRowSpan(data, { key: 'in' }).one)[rowIndex]
        let _col = _row > 0 ? 1 : 0
        return {
            rowspan: !row.children ? _row : 1,
            colspan: !row.children ? _col : 1
        }
    }
}
watch(pageData, (val) => {
    if (!val) return
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 100)
    setstate({
        ...state.value,
        data: val.data || {},
        inData: val.data ? getParams(val.data.parameters) : [],
        outData: val.data && val.data.responses[200] ? getParams(val.data.responses[200].schema.$ref) : []
    })
})
</script>
<template>
  <div class="api-docs-parameters" v-loading="loading">
    <div class="in-params api-docs-section">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor1">2. 输入参数</h3>
        <el-table
        border
        row-key="name"
        header-cell-class-name="bg-header"
        :span-method="(...args:[SpanMethodProps]) => objectSpanMethod(...args, state.inData)"
        v-loading="state.loading"
        default-expand-all
        :data="state.inData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column
            v-for="column in state.inColumns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :min-width="column.minWidth ? column.minWidth : column.width"
            ></el-table-column>
        </el-table>
    </div>
    <div class="out-params api-docs-section">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor2">3. 输出参数</h3>
        <el-table
        border
        row-key="name"
        v-loading="state.loading"
        default-expand-all
        header-cell-class-name="bg-header"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="state.outData"
        >
            <el-table-column
            v-for="column in state.outColumns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :min-width="column.minWidth ? column.minWidth : column.width"
            ></el-table-column>
        </el-table>
    </div>
  </div>
</template>
<style lang="scss">
</style>