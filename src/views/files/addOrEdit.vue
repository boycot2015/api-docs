<template>
    <el-dialog
    width="520"
    :title="`${form.id?'编辑':'新增'}文件`"
    centered
    top="10vh"
    :lock-scroll="true"
    :append-to-body="true"
    :model-value="modelValue"
    @close="onClose">
        <el-form class="web-setting-form" ref="formRef" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="" prop="icon" label-width="0px">
                <div class="tc flexbox-h align-c just-c" style="width:100%;height: 160px;padding: 10px;border:1px dashed #ccc;overflow: hidden;">
                    <Image fit="cover" :src="form.origionUrl" lazy></Image>
                </div>
            </el-form-item>
            <el-form-item label="文件名称" prop="name">
                <el-input placeholder="文件名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="文件地址" prop="url">
                <el-input type="textarea" :rows="5" placeholder="文件地址, 如：http/https://xxx.com" v-model="form.url"></el-input>
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
import { apiUrl } from '@/api/baseUrl'
import http from '@/api/request'
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
const emits = defineEmits(['update:modelValue', 'onSubmit'])
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
    origionUrl: props.data?.origionUrl || '',
    replace: false
})
const onClose = () => {
    formRef.value?.resetFields()
    emits('update:modelValue', false)
}
const onSubmit = () => {
    formRef.value?.validate((valid) => {
        if (!valid) {
            return
        }
        let config:any = {
            url: form.value.url,
            name: form.value.name
        }
        if (form.value.id) {
            http.post(apiUrl + '/files/update', { id:form.value.id, name: config.name, url: config.url }).then((res: any) => {
            if (res.success) {
                ElMessage.success('操作成功')
                emits('onSubmit', config)
                onClose()
            }
        })
        }
    })
}
</script>