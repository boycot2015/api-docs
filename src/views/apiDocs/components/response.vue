<script setup lang="tsx">
import { computed, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import type { ColumnProps, FormProps } from '../tools'
import { getParams, arr2obj, getCustomParams } from '../tools'
import http from '@/api/request'
import { baseServeUrl } from '@/api/baseUrl'
import useState from '@/hooks/useState'
const router = useRouter()
const loading = ref(false)
const [ showParams, toggleShowParams ] = useState(true)
const [ responses, setResponses ] = useState({})
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const ruleFormRef = ref<FormInstance>()
let state = reactive({
    loading: false,
    data: pageData.value.data,
    url: pageData.value.url,
    method: pageData.value.method,
    inData: [...getCustomParams(pageData.value), ...getParams(pageData.value.data?.parameters || [])],
    outData: getParams(pageData.value.data.responses[200].schema.$ref),
    name: pageData.value.name
})
const initFormData = (arr:any) => {
    let form:FormProps = {}
    arr.map((el:ColumnProps) => {
        if (el.in === 'body' || el.in === 'query') {
            form.bodyParams = JSON.stringify(arr2obj(el.children || [el], 'children'))
        }
    })
    form.Method = baseServeUrl + state.url
    form.Timestamp = new Date().toLocaleString().replace(/\//g, '-')
    form['Random-Code'] = Math.floor(Math.random() * 100000) + ''
    return form
}
const [form, setForm] = useState({...initFormData([...getCustomParams(pageData.value), ...getParams(pageData.value.data.parameters || [])]) } as FormProps)

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
            let data = {
                ...JSON.parse(form.value.bodyParams || '{}'),
                loading: true
            }
            if (state.method === 'get') {
                data = {
                    params: data
                }
            }
            http.request({
                method: state.method,
                url: state.url,
                data,
                headers: { ...headerParams }
            }).then(res => {
                setResponses(res)
                setForm({
                    ...form.value,
                    Timestamp: new Date().toLocaleString().replace(/\//g, '-'),
                    ['Random-Code']: Math.floor(Math.random() * 100000) + ''
                })
            }).catch(err => {
                setResponses(err)
                setForm({
                    ...form.value,
                    Timestamp: new Date().toLocaleString().replace(/\//g, '-'),
                    ['Random-Code']: Math.floor(Math.random() * 100000) + ''
                })
            })
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
    setResponses({})
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
    setResponses({})
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
                <el-link class="mr16" v-if="(state.inData && state.inData.length) || form.bodyParams" @click="toggleShowParams(!showParams)">{{!showParams ? '展开' : '收起'}} <el-icon style="margin-left:5px;"><ArrowDownBold v-if="!showParams" /> <ArrowUpBold v-else /></el-icon> </el-link>
                <el-button type="primary" @click="onSubmit(ruleFormRef)">测试一下</el-button>
                <el-button @click="onReset(ruleFormRef)">重置</el-button>
            </div>
        </div>
        <el-form :model="form" ref="ruleFormRef" label-width="120px" v-show="showParams">
            <el-form-item label="请求头参数" :inline="false" v-if="state.inData && state.inData.length">
                <el-form-item style="width: 100%;margin-bottom: 20px;" :prop="item.name" :rules="[{required: item.required, message: item.name + '不能为空', tigger: 'change'}]" :label="item.name" v-for="item in state.inData.filter((el:any) => el.in === 'header')" :key="item.name">
                    <el-input v-model="form[item.name]" :placeholder="item.description"></el-input>
                </el-form-item>
            </el-form-item>
            <el-form-item :label="`${state.method === 'post'?'body':'query'}参数`" :rules="[{required: true, message: `${state.method === 'post'?'body':'query'}参数不能为空`, tigger: 'change'}]" prop="bodyParams" :inline="false">
                <!-- <el-form-item style="width: 100%;margin-bottom: 20px;" :prop="item.name" :rules="[{required: item.required && !item.children, message: item.name + '不能为空', tigger: 'change'}]" :label="item.name" v-for="item in state.inData.filter(el => el.in === 'body').map(el => el.children)[0]" :key="item.name">
                    <el-input v-model="form[item.name]" :style="{marginBottom: item.children ?'10px': ''}" :disabled="!!item.children" :placeholder="item.description"></el-input>
                    <template v-if="item.children">
                        <el-form-item  style="width: 100%;margin-bottom: 20px;margin-left:-50px;" :prop="val.name" :rules="[{required: val.required, message: val.name + '不能为空', tigger: 'change'}]" :label="val.name" v-for="val in item.children" :key="val.name">
                            <el-input v-model="form[val.name]" :placeholder="val.description"></el-input>
                        </el-form-item>
                    </template>
                </el-form-item> -->
                    <el-input rows="8" type="textarea" v-model="form.bodyParams" :style="{marginBottom: '10px'}" :placeholder="`请输入${state.method === 'post'?'body':'query'}参数`"></el-input>
            </el-form-item>
        </el-form>
        <pre>{{ responses }}</pre>
    </div>
  </div>
</template>
<style lang="scss">
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