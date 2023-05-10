<script setup lang="tsx">
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import{ copyToClipboard, JSONStringify, JSONParse } from '@/utils'
import type { ColumnProps, FormProps } from '../tools'
import { getParams, arr2obj, getCustomParams } from '../tools'
import http from '@/api/request'
import { useAppConfigStore } from '@/stores/app'
import { baseServeUrl, baseUrl } from '@/api/baseUrl'
import useState from '@/hooks/useState'
const appConfigStore = useAppConfigStore()

const router = useRouter()
const loading = ref(false)
const [ showParams, toggleShowParams ] = useState(true)
const pageData:any = computed(() => router.currentRoute.value.meta?.pageData)
const [ responses, setResponses ] = useState(arr2obj(pageData.value.method, pageData.value.data?.responses[200]?.schema?.$ref || []))

const ruleFormRef = ref<FormInstance>()
let state = reactive({
    loading: false,
    responseLoading: false,
    data: pageData.value.data,
    url: (appConfigStore.appConfig?.apiUrl || baseUrl) + (appConfigStore.appConfig?.baseUrl || '') + pageData.value.url,
    method: pageData.value.method,
    pramsObj: {
        name: '',
        value: '',
        required: false,
        closeable: true,
        in: 'header',
        description: '',
    },
    inData: [...getCustomParams(pageData.value), ...getParams(pageData.value.data?.parameters || [])],
    outData: getParams(pageData.value.data?.responses[200]?.schema?.$ref || []),
    name: pageData.value.name
})
const initFormData = (arr:any) => {
    let form:FormProps = {}    
    let bodyParams = state.method === 'post' ? {}: arr2obj(pageData.value.method, arr.filter((el:any) => el.in === 'query'), 'children')
    arr.map((el:ColumnProps) => {
        if (el.in === 'body') {
            form.bodyRequired = Boolean(el.required)
            bodyParams = { ...bodyParams, ...arr2obj(pageData.value.method, el.children || [el], 'children') }
        }
    })
    form.bodyParams = JSONStringify(bodyParams)
    form.Method = baseServeUrl + state.url
    form.Timestamp = new Date().toLocaleString().replace(/\//g, '-')
    form['Random-Code'] = Math.floor(Math.random() * 100000) + ''
    return form
}
const [form, setForm] = useState({...initFormData([...getCustomParams(pageData.value), ...getParams(pageData.value.data?.parameters || [])]) } as FormProps)

const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    toggleShowParams(true)
    formEl.validate((valid) => {
        if (valid) {
            // console.log('submit!')
            let headerParams:any = {}
            let arr =  state.inData.filter((el:any) => el.in === 'header').map((el:any) => el.name)
            for (const key in form.value) {
                if (arr.includes(key)) {
                    headerParams[key] = form.value[key]
                }
            }
            let params:any = {
                method: state.method,
                url: (appConfigStore.appConfig?.apiUrl || '') + pageData.value.url,
                headers: { ...headerParams }
            }
            try {
                params.data = {
                    ...JSONParse(form.value.bodyParams || '{}'),
                    loading: true
                }
            } catch (error) {
                ElMessage.error('参数格式不正确，请重新输入！'+ error)
                return
            }
            for (const key in params.data) {
                if (!params.data[key]) {
                    delete params.data[key]
                }
            }
            if (state.method === 'get') {
                params.params = params.data
                delete params.data
            }
            state.responseLoading = true
            if (import.meta.hot) {
                import.meta.hot.send('getDataByApiUrl', params)
                import.meta.hot.on('getDataByApiUrl', (res) => {
                    if (res) {
                        setResponses(JSONStringify(res))
                        setForm({
                            ...form.value,
                            Timestamp: new Date().toLocaleString().replace(/\//g, '-'),
                            ['Random-Code']: Math.floor(Math.random() * 100000) + ''
                        })
                    } else {
                        try {
                            setResponses(JSONStringify(res || {}))
                        } catch (error) {
                            setResponses(error)
                        }
                        setForm({
                            ...form.value,
                            Timestamp: new Date().toLocaleString().replace(/\//g, '-'),
                            ['Random-Code']: Math.floor(Math.random() * 100000) + ''
                        })
                    }
                    state.responseLoading = false
                })
            } else {
                http.request(params).then((res:any) => {
                    setResponses(JSONStringify(res))
                    setForm({
                        ...form.value,
                        Timestamp: new Date().toLocaleString().replace(/\//g, '-'),
                        ['Random-Code']: Math.floor(Math.random() * 100000) + ''
                    })
                    state.responseLoading = false
                }).catch((err:any) => {
                    try {
                        setResponses(JSONStringify(err))
                    } catch (error) {
                        setResponses(error)
                    }
                    setForm({
                        ...form.value,
                        Timestamp: new Date().toLocaleString().replace(/\//g, '-'),
                        ['Random-Code']: Math.floor(Math.random() * 100000) + ''
                    })
                    state.responseLoading = false
                })
            }
        } else {
            return false
        }
    })
}
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    setForm({
        ...initFormData(state.inData)
    })
    setResponses(arr2obj(pageData.value.method, pageData.value.data?.responses[200]?.schema?.$ref || []))
}
const delParams = (item:any, index:number) => {
    state.inData = state.inData.filter((el: any) => item.name !== el.name)
    
}
const addParams = () => {
    if (!state.pramsObj.name) return
    if (state.inData.map(el => el.name.toLowerCase()).includes(state.pramsObj.name.toLowerCase())) return
    setForm({
        ...form.value,
        [state.pramsObj.name]: state.pramsObj.value
    })
    state.inData.push(state.pramsObj)
    state.pramsObj = {
        name: '',
        value: '',
        required: false,
        closeable: true,
        in: 'header',
        description: ''
    }
    
}
const onCopy = () => {
    const text:any = document.querySelector('.api-docs-response .code code')
    copyToClipboard(text.innerText)
    ElMessage.success('复制成功！')
}
watch(pageData, (val) => {
    if (!val) return
    state = {
        ...state,
        data: val.data || {},
        url: val.url,
        method: val.method,
        name: val.name,
        inData: [...getCustomParams(pageData.value), ...getParams(val.data?.parameters || [])],
        outData: val.data && val.data.responses[200] ? getParams(val.data?.responses[200]?.schema?.$ref || []) : []
    }
    toggleShowParams(true)
    setResponses(arr2obj(pageData.value.method, val.data?.responses[200]?.schema?.$ref || []))
    ruleFormRef.value?.resetFields()
    setForm({ ...form, ...initFormData([...getCustomParams(pageData.value), ...getParams(val.data?.parameters || [])]) })
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 100)
})
</script>
<template>
  <div class="api-docs-response">
    <div class="api-docs-section" style="padding-bottom: 10px;">
        <div class="top clearfix sub-title">
            <h3 class="app-page-anchor fl" style="margin: 0;" id="app-page-anchor3">
                4. 响应示例
            </h3>
            <div class="action fr">
                <el-link class="mr16" v-if="(state.inData && state.inData.length) || form.bodyParams" @click="toggleShowParams(!showParams)">{{!showParams ? '展开' : '收起'}} <el-icon style="margin-left:5px;"><IconifyIcon name="ep:arrow-down-bold" v-if="!showParams" :iconStyle="{ }" /><IconifyIcon  v-else name="ep:arrow-up-bold" :iconStyle="{ }" /></el-icon> </el-link>
                <el-button type="primary" v-prevent @click="onSubmit(ruleFormRef)">测试一下</el-button>
                <el-button @click="onReset(ruleFormRef)">重置</el-button>
            </div>
        </div>
        <el-form :model="form" ref="ruleFormRef" label-width="120px">
            <el-form-item label="请求头参数" :inline="false" v-if="state.inData && state.inData.length">
                <el-form-item style="width: 100%;margin-bottom: 20px;" v-for="(item, index) in state.inData.filter((el:any) => el.in === 'header')" :prop="item.name" :rules="[{required: item.required, message: item.name + '不能为空', tigger: 'change'}]" :label="item.name" :key="item.name">
                    <div class="action">
                        <el-input clearable :style="item.closeable? { width: '85.5%', marginRight: '16px' }: {}" v-model="form[item.name]" :placeholder="item.description || '请输入'"></el-input>
                        <el-button type="danger" v-if="item.closeable" @click="() => delParams(item, index)">移除</el-button>
                    </div>
                </el-form-item>
                <el-form-item style="width: 100%;margin-bottom: 20px;">
                    <div class="action">
                        <div class="input">
                            <el-input clearable style="width: 40%;" v-model="state.pramsObj.name" placeholder="参数名"></el-input>
                            <el-input clearable style="margin-left: 2%;width: 40%;" v-model="state.pramsObj.value" placeholder="参数值"></el-input>
                            <el-checkbox style="margin-left: 2%;" v-model="state.pramsObj.required">必填</el-checkbox>
                        </div>
                        <el-button style="margin-left: 16px;" class="fr" @click="addParams">添加</el-button>
                    </div>
                </el-form-item>
            </el-form-item>
            <el-form-item :label="`${state.method === 'post'?'body':'query'}参数`" :rules="[{required: form.bodyRequired, message: `${state.method === 'post'?'body':'query'}参数不能为空`, tigger: 'change'}]" prop="bodyParams" :inline="false">
                    <el-input rows="8" type="textarea" v-model="form.bodyParams" :style="{marginBottom: '10px'}" :placeholder="`请输入${state.method === 'post'?'body':'query'}参数，示例：{ &quot;id&quot;: 1 }`"></el-input>
            </el-form-item>
        </el-form>
        <div class="name">响应数据</div>
        <div v-highlight class="code" v-show="showParams" v-loading="state.responseLoading">
            <span class="copy" @click="onCopy">json 复制代码</span>
            <pre><code class="JSON"> {{ responses }}</code></pre>
        </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.api-docs-response {
    .code {
        position: relative;
        .copy {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
        pre {
            color: var(--vt-c-black);
            code {
                background-color: var(--vt-c-white-soft);
                border-radius: var(--border-radius);
                overflow: auto;
                // max-width: 900px;
            }
        }
    }
    .top {
        position: --webkit-sticky;
        position: sticky;
        z-index: 9;
        top: -16px;
        padding-top: 10px;
        background-color: var(--vt-c-white);
    }
    .el-form {
        .action {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .input {
                flex: 1;
            }
        }
    }
}
</style>