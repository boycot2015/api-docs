<template>
    <el-dialog
    width="400"
    :title="`${form.id?'编辑':'新增'}文件`"
    centered
    top="30vh"
    :lock-scroll="true"
    :append-to-body="true"
    :model-value="modelValue"
    @close="onClose">
        <el-form class="web-setting-form" ref="formRef" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="" prop="icon">
                <el-image :src="form.url"></el-image>
            </el-form-item>
            <el-form-item label="文件名称" prop="name">
                <el-input placeholder="文件名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="文件地址" prop="url">
                <el-input placeholder="文件地址, 如：http/https://xxx.com" v-model="form.url"></el-input>
            </el-form-item>
        </el-form>
        <div class="el-dialog__footer">
        <el-button @click="onClose">取消</el-button>
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
    name: [{ required: true, message: '文件名称不能为空' }],
    url: [{ required: true, message: '文件地址不能为空' }]
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