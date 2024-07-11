<script lang="ts" setup>
import { useAppConfigStore } from '@/stores/app'
import { baseUrl } from '@/api/baseUrl'
import storage from '@/utils/storage'
import config from '@/config'
import router from '@/router'
import { downloadFile } from '@/utils'
import Loading from '@/hooks/loading'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps, UploadFile } from 'element-plus'
interface AppProps {
    id: number
    url: string
    replace: boolean
    name: string
}
defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})
const rules = reactive<FormRules>({
    primaryColor: [{ required: true, message: '主题色不能为空' }],
    logoPosition: [{ required: true, message: 'logo位置不能为空' }],
    // 'footer': [{ type: 'array', required: true, message: '友情链接不能为空' }],
    apiUrl: [{ required: true, message: 'swagger地址不能为空' }]
})
const emits = defineEmits(['update:modelValue'])

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const accordion = ref('1')
const drawerFormRef = ref<FormInstance|undefined>()
const { setAppConfig } = useAppConfigStore()
const appConfig:any = computed(() => useAppConfigStore().appConfig)
const root:any = document.querySelector(':root')
const fileList = ref<UploadFile[]>([])
const form = ref({
    websiteName: appConfig.value.websiteName,
    primaryColor: appConfig.value.primaryColor || getComputedStyle(root).getPropertyValue('--el-color-primary'),
    showBreadcrumb: appConfig.value.showBreadcrumb,
    showMenuInHeader: appConfig.value.showMenuInHeader,
    logoPosition: appConfig.value.logoPosition,
    baseUrl: appConfig.value.baseUrl || '',
    apiUrl: appConfig.value.apiUrl || baseUrl,
    apiList: appConfig.value.apiList as AppProps[],
    footer: {
        ...appConfig.value.footer
    },
    currentEffect: appConfig.value.currentEffect || 3
})
const apiObj = ref<{apiUrl:string}>({ apiUrl: appConfig.value.apiUrl || baseUrl })
const isLimit = ref(form.value.footer.links ? form.value.footer.links.length > 6 : false)
watch(form.value.footer.links, (val) => {
    isLimit.value = val.length > 5
})
const initData = () => {
    resetForm({ ...config, ...appConfig.value })
}
const onEffectChange = (index?:number, select?:boolean) => {
    window.onclick = null
    window.onmousedown = null
    window.onmouseup = null
    const canvas:HTMLCanvasElement[] = document.querySelectorAll('body > canvas') as any
    if (canvas !== null && canvas.length) {
        canvas.forEach((el:HTMLCanvasElement) => {
            el.parentNode?.removeChild(el)
        })
    }
    select && setAppConfig({ primaryColor: form.value.primaryColor, currentEffect:  index })
    if (index!== undefined && index < 0) return
    index !== -1 && appConfig.value.effect[3]?.cb()
    index !== undefined && appConfig.value.effect[index]?.cb()
}
const onColorPickerChange = (select?:boolean) => {
    root.style.setProperty('--el-color-primary', form.value.primaryColor)
}

const onClose = () => {
  emits('update:modelValue', false)
}
const onReload = () => {
    if (form.value.apiUrl !== appConfig.value.apiUrl) {
        Loading({ text: '正在同步数据，请稍后...' })
        storage.removeItem('routes')
        if (router.currentRoute.value.path !== '/') {
            window.location.reload()
        } else {
            window.location.href = '/'
        }
        setAppConfig({ ...form.value, ...apiObj.value, apiList: form.value.apiList.map(el => {
            el.replace = false
            if (apiObj.value.apiUrl === el.url) {
                el.replace = true
            }
            return el
            })
        })
        Loading().close()
    } else {
        Loading({ text: '正在保存设置，请稍后...' })
        setAppConfig({ ...form.value, ...apiObj.value })
        setTimeout(() => {
            Loading().close()
            ElMessage.success('保存成功')
        }, 500);
    }
    emits('update:modelValue', false)
}
const onSubmit = () => {
    drawerFormRef.value?.validate((valid) => {
        if (!valid) {
            accordion.value = '1'
            return
        }
        onReload()
    })
}
const resetForm = (val?:any) => {
    form.value.primaryColor = val.primaryColor
    form.value.showBreadcrumb = val.showBreadcrumb
    form.value.showMenuInHeader = val.showMenuInHeader
    form.value.currentEffect = val.currentEffect
    form.value.logoPosition = val.logoPosition
    form.value.baseUrl = val.baseUrl
    form.value.apiUrl = val.apiUrl
    form.value.footer = val.footer
    apiObj.value = {
        apiUrl: val.apiUrl
    }
}
const onReset = () => {
    ElMessageBox.confirm('重置操作会清空本地数据，恢复初始状态，确认重置？', '温馨提示').then(() => {
        resetForm(config)
        storage.removeItem('routes')
        storage.removeItem('websiteConfig')
        setAppConfig(config)
        onEffectChange(config.currentEffect)
        root.style.setProperty('--el-color-primary', config.primaryColor)
        Loading({ text: '正在保存设置，请稍后...' })
        setTimeout(() => {
            Loading().close()
            window.location.reload()
        }, 500);
    }).catch(() => {})
}
const onLinksSort = (lindex:number, type:string) => {
    let temp = form.value.footer.links.splice(lindex, 1)[0]
    if (type === 'down') {
        form.value.footer.links.splice(lindex + 1, 0, temp)
    } else {
        form.value.footer.links.splice(lindex - 1, 0, temp)
    }
}
const onExport = () => {
    downloadFile(form.value, 'webSiteConfig', 'json')
}
const onImportSuccess = (data:any) => {
    form.value = {
        ...form.value,
        ...data
    }
    accordion.value = '1'
    fileList.value = []
    Loading({ text: '正在导入数据，请稍后...' })
    setTimeout(() => {
        setAppConfig({ ...form.value })
        onColorPickerChange()
        Loading().close()
        ElMessageBox.alert('导入成功：' + '<div style="width: 360px;max-height:400px;overflow:auto;background: #f8f8f8;padding: 10px;" v-highlight><code class="">'+JSON.stringify(data)+'</code></div>', '温馨提示', {
            dangerouslyUseHTMLString: true,
        }).then(() => {
            emits('update:modelValue', false)
            window.location.reload()
        }).catch(() => {})
    }, 1000);
}
const onFileChange = (file:any) => {
    if (file.raw.type !== 'application/json') {
        ElMessage.error('仅支持导入json格式的文件!')
        return false
    } else if (file.raw.size / 1024 / 1024 > 100) {
        ElMessage.error('文件大小不能超过 100MB!')
        return false
    }
    let reader = new FileReader()   //先new 一个读文件的对象 FileReader
    if (typeof FileReader === "undefined") {  //用来判断你的浏览器是否支持 FileReader
        ElMessage({
            type: "info",
            message: "您的浏览器不支持文件读取。"
        })
        return
    }
    reader.readAsArrayBuffer(file.raw) //读任意文件
    reader.onload = function (e:any) {
        var ints = new Uint8Array(e.target.result) //要使用读取的内容，所以将读取内容转化成Uint8Array
        ints = ints.slice(0, 5000) //截取一段读取的内容
        let data:any = new TextDecoder('utf-8').decode(ints) //二进制缓存区内容转化成中文（即也就是读取到的内容）
        try {
            data = JSON.parse(data)
        } catch (error) {
            data = {}
        }
        onImportSuccess(data)
        // console.log(rawFile, data, 'rawFile');
    }
    return false
}
onEffectChange(form.value.currentEffect)
onColorPickerChange()
</script>
<style lang="scss" scoped>
html,body {
    overflow: hidden;
}
</style>
<style lang="scss">
.web-setting-form {
    padding: 0;
}
.color-picker {
    .el-color-picker {
        margin-right: 10px;
    }
}
.el-drawer__body {
    padding-top: 0;
    padding-bottom: 58px;
}
.el-drawer__footer {
    position: absolute;
    bottom: -10px;
    width: 100%;
    left: 0;
    background-color: #fff;
    border-top: 1px solid #f8f8f8;
}
.el-collapse {
    border-top: 0;
}
</style>
<template>
    <el-drawer
    size="480"
    title="网站设置"
    ref="drawerRef"
    :lock-scroll="true"
    :append-to-body="true"
    :model-value="modelValue"
    @opened="initData"
    @close="onClose">
        <el-form class="web-setting-form" ref="drawerFormRef" :model="form" label-width="110px" :rules="rules">
            <el-tabs v-model="accordion" accordion>
                <el-tab-pane name="1" label="基础设置">
                    <el-form-item label="主题色" prop="primaryColor" class="color-picker">
                        <el-color-picker style="max-width: 200px;" v-model="form.primaryColor" @change="() => onColorPickerChange(true)" :predefine="predefineColors" show-alpha />
                        <span>{{ form.primaryColor }}</span>
                    </el-form-item>
                    <el-form-item label="面包屑导航" prop="showBreadcrumb">
                        <el-switch v-model="form.showBreadcrumb"></el-switch>
                    </el-form-item>
                    <el-form-item label="头部菜单" prop="showMenuInHeader">
                        <el-switch v-model="form.showMenuInHeader"></el-switch>
                    </el-form-item>
                    <el-form-item label="logo位置" prop="logoPosition">
                        <el-radio-group v-model="form.logoPosition">
                            <el-radio :value="'top'" :label="'top'">头部</el-radio>
                            <el-radio :value="'bottom'" :label="'bottom'">侧边栏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="特效" prop="currentEffect">
                        <el-select v-model="form.currentEffect" class="effect" style="width:100%;margin-right: 10px;" placeholder="特效" @change="(val:any) => onEffectChange(val, true)">
                            <el-option  :label="'无'" :value="-1"></el-option>
                            <el-option v-for="(item, index) in appConfig.effect as AppProps[]" :label="item.name" :value="index" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站名称" :rules="[{required: true, message: '网站名称不能为空'}]" prop="websiteName">
                        <el-input placeholder="网站名称" maxlength="15" v-model="form.websiteName"></el-input>
                    </el-form-item>
                    <el-form-item label="友情链接" prop="footer.links">
                        <el-form-item
                        v-for="(link, lindex) in form.footer.links"
                        :prop="'footer.links.'+ lindex +'.name'"
                        :rules="[{required: true, message: '友情链接不能为空', trigger: 'change'}]"
                        :key="lindex">
                            <el-input style="margin-bottom: 5px;width:82%" placeholder="链接名称" v-model="form.footer.links[lindex].name"></el-input>
                            <el-icon v-if="lindex !== form.footer.links.length - 1" style="margin-left: 5px;cursor: pointer;" @click="onLinksSort(lindex, 'down')"><IconifyIcon name="ep:sort-down" :iconStyle="{ }" /></el-icon>
                            <el-icon v-if="lindex" style="cursor: pointer;" @click="onLinksSort(lindex, 'up')"><IconifyIcon name="ep:sort-up" :iconStyle="{ }" /></el-icon>
                            <el-icon v-if="form.footer.links.length > 1" style="margin-left: 5px;cursor: pointer;" @click="form.footer.links.splice(lindex, 1)"><IconifyIcon name="ep:delete" :iconStyle="{ }" /></el-icon>
                            <el-icon v-if="lindex === form.footer.links.length - 1 && !isLimit" style="margin-left: 5px;cursor: pointer;" @click="form.footer.links.push({name: '', href: '',  target: '_blank'})"><IconifyIcon name="ep:plus" :iconStyle="{ }" /></el-icon>
                            <el-input style="margin-bottom: 5px" placeholder="链接地址" v-model="form.footer.links[lindex].href"></el-input>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="copyright" :rules="[{required: true, message: 'copyright不能为空'}]" prop="footer.copyright">
                        <el-input placeholder="copyright" v-model="form.footer.copyright"></el-input>
                    </el-form-item>
                    <el-form-item label="备案信息" :rules="[{required: true, message: '备案信息不能为空'}]" prop="footer.beian.name">
                        <el-input placeholder="备案信息" v-model="form.footer.beian.name"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="2" label="接口设置">
                    <el-form-item label="基础公共地址" prop="baseUrl">
                        <el-input placeholder="接口地址前缀，如：/api" v-model="form.baseUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="项目名称" prop="apiUrl">
                        <el-select filterable v-model="form.apiUrl" @change="apiObj.apiUrl = form.apiUrl" style="width: 92%;margin-bottom: 5px;">
                            <el-option v-for="api in form.apiList" :label="api.name" :value="api.url" :key="api.name"></el-option>
                        </el-select>
                        <el-icon title="新增项目" style="margin-left: 5px;margin-bottom: 5px;cursor: pointer;" @click="$router.push('/apps/index');onClose();"><IconifyIcon name="ep:plus" :iconStyle="{ }" /></el-icon>
                    </el-form-item>
                    <el-form-item label="项目地址" prop="apiUrl">
                        <el-input style="width:100%" placeholder="链接名称" v-model="apiObj.apiUrl"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="3" label="导入导出">
                    <div class="btns" style="margin-top: 10px;">
                        <el-upload
                        class="upload fl"
                        accept=".json"
                        action="/"
                        :limit="1"
                        :auto-upload="false"
                        show-file-list
                        v-model:file-list="fileList"
                        :on-change="onFileChange">
                            <el-button icon="el:download" class="fl" @click="onExport">
                                <el-icon :size="20"><IconifyIcon name="ep:download" :iconStyle="{ }" /></el-icon>
                                下载导入模板
                            </el-button>
                            <template #trigger>
                                <el-button style="margin-left: 10px;" type="primary">
                                    <el-icon :size="20"><IconifyIcon name="ep:upload" :iconStyle="{ }" /></el-icon>
                                    导入数据
                                </el-button>
                            </template>
                            <template #tip>
                                <div class="el-upload__tip">
                                    仅支持导入json格式的文件
                                </div>
                            </template>
                        </el-upload>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div class="el-drawer__footer" v-if="accordion!=='3'">
            <el-button @click="onReset" type="danger">重置</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </el-drawer>
</template>