<script setup lang="tsx">
import { useRouter } from 'vue-router'
import type { TableColumnCtx } from 'element-plus'
import type { Column, ColumnProps, SpanMethodProps } from '../tools'
import { getParams, getCustomParams } from '../tools'
import useState from '@/hooks/useState'
import { getRowSpan } from '@/utils'
const props = defineProps({
    columns: {
    type: Array as unknown as PropType<[Column]>,
    default: () => [
        { prop: 'name', label: '参数名称', width: 200 },
        { prop: 'type', label: '类型', width: 80 },
        { prop: 'required', label: '是否必传', width: 100 },
        { prop: 'description', label: '说明', width: 220 },
        { prop: 'format', label: '其他', formatter: (row:ColumnProps, column:TableColumnCtx<Column>) => row.format ? 'format:'+ row.format : '', width: 120 },
    ],
  }
})
const router = useRouter()
const loading = ref(false)
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const [ state, setState ] = useState({
    loading: false,
    method: pageData.value.method,
    data: pageData.value.data,
    inData: [...getCustomParams(pageData.value), ...getParams(pageData.value.data?.parameters || [])],
    columns: props.columns,
    outData: getParams(pageData.value.data?.responses[200]?.schema?.$ref || [])
})

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps, data:any) => {
    // console.log(row, 'data');
    let property = column.property
    let spans:any = state.value.columns.filter((el:any) => el.span)
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
    setState({
        ...state.value,
        data: val.data || {},
        inData: [...getCustomParams(pageData.value), ...getParams(val.data?.parameters || [])],
        outData: val.data && val.data?.responses[200] ? getParams(val.data.responses[200]?.schema?.$ref || []) : []
    })
})
</script>
<template>
  <div class="api-docs-parameters" v-loading="loading">
    <div class="in-params api-docs-section">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor1">2. 请求参数</h3>
        <h3 class="sub-title-item">Headers</h3>
        <el-table
        border
        ref="tableRef"
        row-key="name"
        header-cell-class-name="bg-header"
        :span-method="(...args:[SpanMethodProps]) => objectSpanMethod(...args, state.inData)"
        v-loading="state.loading"
        default-expand-all
        :data="state.inData.filter((l:any) => l.in === 'header')"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :formatter="column.formatter"
            :min-width="column.minWidth ? column.minWidth : column.width"
            ></el-table-column>
        </el-table>
    </div>
    <div class="in-params api-docs-section">
        <h3 class="sub-title-item">{{ state.method === 'post'?'Body':'Query' }}</h3>
        <el-table
        border
        row-key="name"
        ref="tableRef"
        header-cell-class-name="bg-header"
        :span-method="(...args:[SpanMethodProps]) => objectSpanMethod(...args, state.inData)"
        v-loading="state.loading"
        default-expand-all
        :data="state.inData.filter((l:any) => state.method === 'post' ? l.in === 'body': (l.in === 'query' || l.in === 'body'))"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :formatter="column.formatter"
            :min-width="column.minWidth ? column.minWidth : column.width"
            ></el-table-column>
        </el-table>
    </div>
    <div class="out-params api-docs-section">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor2">3. 返回数据</h3>
        <el-table
        border
        ref="tableRef"
        row-key="name"
        v-loading="state.loading"
        default-expand-all
        header-cell-class-name="bg-header"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="state.outData"
        >
            <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            :formatter="column.formatter"
            :min-width="column.minWidth ? column.minWidth : column.width"
            ></el-table-column>
        </el-table>
    </div>
  </div>
</template>
<style lang="scss">
</style>