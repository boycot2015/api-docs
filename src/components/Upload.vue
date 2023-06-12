<template>
    <el-upload
        v-model:file-list="fileList"
        class="upload"
        :show-file-list="false"
        :action="props.action || (apiUrl+'/upload')"
        :multiple="!!props.multiple"
        :drag="!!props.drag"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="props.limit || 10"
        :on-success="handleSuccess"
        :on-exceed="handleExceed"
    >
        <template v-if="props.drag">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽/点击上传文件, 上传的文件不能大于 500KB.
            </div>
        </template>
        <el-button v-else type="primary">上传文件</el-button>
        <template #tip v-if="!props.drag">
            <div class="el-upload__tip">
                上传的文件不能大于 500KB.
            </div>
        </template>
    </el-upload>
</template>
<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiUrl } from '@/api/baseUrl'
import type { UploadProps, UploadUserFile } from 'element-plus'
const emits = defineEmits(['onSuccess', 'beforeRemove', 'onRemove', 'onPreview', 'onExceed'])
const props = defineProps(['type', 'drag', 'show-file-list', 'multiple', 'limit', 'fileList', 'action'])

const fileList = ref<UploadUserFile[]>(props.fileList || [])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
  emits('onRemove', file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
  emits('onPreview', uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `限制最多可上传1个文件`
  )
  emits('onExceed', files, uploadFiles)
}
const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile, uploadFiles) => {
//   console.log(response, fileList.value, 'response')
  fileList.value.map((el:any) => {
    el.url = el.response?.data
  })
  emits('onSuccess', fileList.value)
}
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    emits('beforeRemove', uploadFile, uploadFiles)
    return ElMessageBox.confirm(
        `确定删除 ${uploadFile.name} ?`
    ).then(
        () => {
            emits('beforeRemove', uploadFile, uploadFiles)
            return true
        },
        () => false
    )
}
</script>
<style lang="scss" scoped>
:deep(.el-upload-dragger) {
    padding: 10px;
    .el-icon--upload {
        font-size: 28px;
        line-height: 32px;
        margin-bottom: 10px;
    }
}
</style>