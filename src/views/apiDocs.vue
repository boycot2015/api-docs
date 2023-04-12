<script setup lang="ts">
import { useAnchorStore, useCollapseStore } from '@/stores/app'
import { computed, onMounted, reactive, watch, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnCtx, FormInstance, FormRules } from 'element-plus'
import http from '@/api/request'
import { baseUrl } from '@/api/baseUrl'
import { getRowSpan } from '@/utils'
import useState from '@/hooks/useState'
const router = useRouter()
const appPageAnchors = useAnchorStore()
const [ showParams, toggleShowParams ] = useState(true)
const [ responses, setResponses ] = useState({})
// console.log(router.currentRoute.value, 'currentRoute');
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
interface Dto {
  in: string
  name: string
  type: string
  required: string
  child?: string
  children?: Dto
  description: string
}
interface Cloumn {
  prop: string
  span?: boolean
  label: string
  width?: number
  minWidth?: string
}
interface SpanMethodProps {
  row: Dto
  column: TableColumnCtx<Dto>
  rowIndex: number
  columnIndex: number
}
const ruleFormRef = ref<FormInstance>()
const arr2obj = (arr:any, prop = 'children') => {
    let obj:any = {}
    let types:any = {
        string: '',
        number: 0,
        boolean: false,
        integer: 1
    }
    arr.map((el:any) => {
        obj[el.name] = el.example || types[el.type]
        if (el[prop] && el[prop].length) {
            obj[el.name] = arr2obj(el[prop], prop)
        }
    })
    return obj
}
const getParams = (data:any, child?:boolean, name?:string) => {
    return data.map((el:any = {}) => {
        let children =  el.children ?  el.children || '' : el.schema ? el.schema.$ref || '' : ''
        if (children && children.length) {
            children = getParams(children, true, el.type === 'array' ? 'items': el.type ? el.name : 'body')
        }
        return { ...el, in: el.in || (el.type === 'array' ? 'items': el.type === 'object' ? 'object': name), children, child }
    })
}
const initFormData = (arr:any) => {
    let form:any = {}
    arr.map((el:Dto) => {
        if (el.in === 'body') {
            form.bodyParams = JSON.stringify(arr2obj(el.children, 'children'))
        } else {
            form[el.name] = el.type === 'string' ? '' : el.type === 'boolean' ? false : ''
        }
    })
    form.Timestamp = new Date().toLocaleString().replace(/\//g, '-')
    form['Random-Code'] = Math.floor(Math.random() * 100000) + ''
    return form
}
const [form, setForm] = useState({...initFormData(getParams(pageData.value.data.parameters)) } as any)
const inColumns:Cloumn[] = [
    { prop: 'in', span: true, label: '传递位置', width: 150 },
    { prop: 'name', label: '参数名称', width: 150 },
    { prop: 'type', label: '类型', width: 100 },
    { prop: 'required', label: '是否必传', width: 100 },
    { prop: 'description', label: '说明', width: 180 },
]
const outColumns:Cloumn[] = [
    { prop: 'name', label: '参数名称', width: 100 },
    { prop: 'type', label: '类型', width: 100 },
    { prop: 'required', label: '是否必传', width: 100 },
    { prop: 'description', label: '说明', width: 100 },
]
let state = reactive({
    loading: false,
    data: pageData.value.data,
    url: pageData.value.url,
    method: pageData.value.method,
    inData: getParams(pageData.value.data.parameters),
    outData: getParams(pageData.value.data.responses[200].schema.$ref),
    inColumns,
    outColumns,
    name: pageData.value.name
})


const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps, data:any) => {
    // console.log(row, 'data');
    let property = column.property
    let spans:any = state.inColumns.filter((el:any) => el.span)
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
const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    toggleShowParams(true)
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            let headerParams:any = {}
            let arr =  state.inData.filter((el:any) => el.in === 'header').map((el:any) => el.name)
            for (const key in form.value) {
                if (arr.includes(key)) {
                    headerParams[key] = form.value[key]
                }
            }
            // console.log(form.value.bodyParams, 'headerParams');
            http.post(state.url, {
                ...JSON.parse(form.value.bodyParams || '{}')
            }, {
                headers: { ...headerParams }
            }).then(res => {
                console.log(res, 'res');
                setResponses(res)
            }).catch(err => {
                setResponses(err)
                console.log(err, 'err');
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    setForm({
        ...form,
        ...initFormData(state.inData)
    })
}
watch(pageData, (val) => {
    if (!val) return
    state = {
        ...state,
        data: val.data || {},
        url: val.url,
        method: val.method,
        name: val.name,
        inData: val.data ? getParams(val.data.parameters) : [],
        outData: val.data && val.data.responses[200] ? getParams(val.data.responses[200].schema.$ref) : []
    }
    toggleShowParams(true)
    setResponses({})
    ruleFormRef.value?.resetFields()
    setForm({ ...form, ...initFormData(val.data ? getParams(val.data.parameters) : []) })
    setTimeout(() => {
        document.querySelectorAll!==null && appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
    }, 200);
})
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
})
</script>
<template>
  <div class="api-docs">
    <h1 class="tc title">{{state.name}}</h1>
    <div class="api-docs-section api-desc">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor0">1. 接口说明</h3>
        <div class="api-desc-item">
            <div class="name">1.1 接口请求地址</div>
            <div class="value">【{{state.method}}】{{baseUrl}}{{state.url}}</div>
        </div>
        <div class="api-desc-item">
            <div class="name">1.2 接口描述</div>
            <div class="value">{{state.data.description}}</div>
        </div>
    </div>
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
            :prop="column.prop"
            v-for="column in state.inColumns"
            :key="column.prop"
            :min-width="column.minWidth ? column.minWidth : column.width"
            :label="column.label"></el-table-column>
        </el-table>
    </div>
    <div class="out-params api-docs-section">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor2">3. 输出参数</h3>
        <el-table
        border
        row-key="name"
        v-loading="state.loading"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="state.outData"
        >
            <el-table-column
            :prop="column.prop"
            v-for="column in state.outColumns"
            :key="column.prop"
            :min-width="column.minWidth ? column.minWidth : column.width"
            :label="column.label"></el-table-column>
        </el-table>
    </div>
    <div class="api-docs-section" style="padding-bottom: 10px;">
        <div class="top clearfix sub-title">
            <h3 class="app-page-anchor fl" style="margin: 0;" id="app-page-anchor3">
                4. 响应示例
            </h3>
            <div class="action fr">
                <el-link class="mr16" @click="toggleShowParams(!showParams)">{{!showParams ? '展开' : '收起'}} <el-icon style="margin-left:5px;"><ArrowDownBold v-if="!showParams" /> <ArrowUpBold v-else /></el-icon> </el-link>
                <el-button type="primary" @click="onSubmit(ruleFormRef)">测试一下</el-button>
                <el-button @click="onReset(ruleFormRef)">重置</el-button>
            </div>
        </div>
        <el-form :model="form" ref="ruleFormRef" label-width="120px" v-show="showParams">
            <el-form-item label="请求头参数" :inline="false" >
                <el-form-item style="width: 100%;margin-bottom: 20px;" :prop="item.name" :rules="[{required: item.required, message: item.name + '不能为空', tigger: 'change'}]" :label="item.name" v-for="item in state.inData.filter((el:any) => el.in === 'header')" :key="item.name">
                    <el-input v-model="form[item.name]" :placeholder="item.description"></el-input>
                </el-form-item>
            </el-form-item>
            <el-form-item label="body参数" :rules="[{required: true, message: 'body参数不能为空', tigger: 'change'}]" prop="bodyParams" :inline="false">
                <!-- <el-form-item style="width: 100%;margin-bottom: 20px;" :prop="item.name" :rules="[{required: item.required && !item.children, message: item.name + '不能为空', tigger: 'change'}]" :label="item.name" v-for="item in state.inData.filter(el => el.in === 'body').map(el => el.children)[0]" :key="item.name">
                    <el-input v-model="form[item.name]" :style="{marginBottom: item.children ?'10px': ''}" :disabled="!!item.children" :placeholder="item.description"></el-input>
                    <template v-if="item.children">
                        <el-form-item  style="width: 100%;margin-bottom: 20px;margin-left:-50px;" :prop="val.name" :rules="[{required: val.required, message: val.name + '不能为空', tigger: 'change'}]" :label="val.name" v-for="val in item.children" :key="val.name">
                            <el-input v-model="form[val.name]" :placeholder="val.description"></el-input>
                        </el-form-item>
                    </template>
                </el-form-item> -->
                    <el-input rows="8" type="textarea" v-model="form.bodyParams" :style="{marginBottom: '10px'}" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <pre>{{ responses }}</pre>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.api-docs {
    padding: 30px 0;
    .title {
        font-size: 32px;
        // font-weight: bold;
        line-height: 32px;
        margin-bottom: 30px;
    }
    &-section {
        margin-bottom: 30px;
        .sub-title {
            margin: 0 0 15px;
            padding-bottom: 5px;
            padding-left: 15px;
            position: relative;
            border-bottom: 1px solid var(--vt-c-white-mute);
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-6px);
                width: 8px;
                height: 8px;
                background-color: #ccc;
            }
        }
        .api-desc-item {
            .name {
                margin-left: 20px;
            }
            .value {
                padding: 5px 10px;
                // background-color: var(--vt-c-white-soft);
                margin: 10px 0 10px 30px;
            }
        }
        pre {
            padding: 10px ;
            overflow: auto;
            max-height: 600px;
            border-radius: var(--border-radius);
            background-color: var(--vt-c-white-soft);
            color: var(--vt-c-black);
        }
    .top {
        position: --webkit-sticky;
        position: sticky;
        z-index: 9;
        top: -16px;
        padding-top: 10px;
        background-color: var(--vt-c-white);
    }
    }
}
</style>