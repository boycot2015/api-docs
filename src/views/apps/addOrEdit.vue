<template>
    <el-dialog
    width="400"
    :title="`${form.id?'编辑':'新增'}项目`"
    centered
    top="30vh"
    :lock-scroll="true"
    :append-to-body="true"
    :model-value="modelValue"
    @close="onClose">
        <el-form class="web-setting-form" ref="formRef" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="项目名称" prop="name">
                <el-input placeholder="项目名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="项目图标" prop="icon">
                <el-input placeholder="项目图标, IconifyIcon" v-model="form.icon"></el-input>
            </el-form-item>
            <el-form-item label="项目地址" prop="url">
                <el-input placeholder="项目地址, 如：http/https://xxx.com" v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="替换为当前项目" prop="replace">
                <el-radio-group v-model="form.replace">
                    <el-radio :label="true" :value="true">是</el-radio>
                    <el-radio :label="false" :value="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="el-dialog__footer">
        <el-button @click="onDelete" v-if="form.id" :disabled="appConfig.apiUrl===form.url" type="danger">删除</el-button>
        <el-button @click="onClose" v-else>取消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useAppConfigStore } from '@/stores/app'
import Loading from '@/hooks/loading'
import storage from '@/utils/storage'
const { appConfig, setAppConfig } = useAppConfigStore()
const apiList = computed(() => appConfig.apiList)
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    data: {
        type: Object
    }
})
const formRef = ref<FormInstance>()
const emits = defineEmits(['update:modelValue'])
const rules = reactive<FormRules>({
    name: [{ required: true, message: '项目名称不能为空' }],
    url: [{ required: true, message: '项目地址不能为空' }]
})
watch(props, (val:any) => {
    form.value = {
        ...val.data,
        replace: false
    }
})
const form = ref({
    id: props.data?.id || '',
    name: props.data?.name || '',
    icon: props.data?.icon || '',
    url: props.data?.url || '',
    replace: false
})
const onClose = () => {
    formRef.value?.resetFields()
    emits('update:modelValue', false)
}
const onDelete = () => {
    Loading({ text: '正在删除，请稍后...' })
    ElMessageBox.confirm('确认删除？', '温馨提示').then(() => {
        let index = apiList.value.findIndex((el:any) => el.id === form.value.id)
        apiList.value.splice(index, 1)
        setAppConfig({ apiList: apiList.value })
        emits('update:modelValue', false)
        ElMessage.success('删除成功')
        Loading().close()
    }).catch(() => {
        Loading().close()
    })
}
const onReload = () => {
    if (form.value.replace) {
        Loading({ text: '正在同步数据，请稍后...' })
        storage.removeItem('routes')
        window.location.reload()
        Loading().close()
    } else {
        Loading({ text: '正在保存设置，请稍后...' })
        setTimeout(() => {
        Loading().close()
            ElMessage.success('保存成功')
        }, 500);
    }
    onClose()
}
const onSubmit = () => {
    formRef.value?.validate((valid) => {
        if (!valid) {
            return
        }
        let config:any = {
        }
        if (form.value.replace) {
            config.apiUrl = form.value.url
            config.apiName = form.value.name
            apiList.value.map((el:any) => {
                el.replace = false
            })
        }
        if (form.value.id) {
            let index = apiList.value.findIndex((el:any) => el.id === form.value.id)
            apiList.value.splice(index, 1, { ...form.value })
        } else {
            if (apiList.value.map((el:any) => el.name).includes(form.value.name)) {
                ElMessage.error('应用已存在，请勿重复添加')
            }
            apiList.value.push({ ...form.value, id: apiList.value.length + 1 })
        }
        config.apiList = apiList.value
        setAppConfig({ ...config })
        onReload()
    })
}
</script>