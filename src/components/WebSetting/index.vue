<script lang="ts" setup>
import { useAppConfigStore } from '@/stores/app'
import { baseUrl } from '@/api/baseUrl'
import storage from '@/utils/storage'
import config from '@/config'
import router from '@/router'
import Loading from '@/hooks/loading'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
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
const accordion = ref(['1', '2'])
const apiObj = ref({ name: '', url: '' })
const drawerFormRef = ref<FormInstance|undefined>()
const { appConfig, setAppConfig } = useAppConfigStore()
const root:any = document.querySelector(':root')
const form = ref({
    primaryColor: appConfig.primaryColor || getComputedStyle(root).getPropertyValue('--el-color-primary'),
    showBreadcrumb: appConfig.showBreadcrumb,
    logoPosition: appConfig.logoPosition,
    baseUrl: appConfig.baseUrl || '',
    apiUrl: appConfig.apiUrl || baseUrl,
    apiList: appConfig.apiList,
    footer: {
        ...appConfig.footer
    },
    currentEffect: appConfig.currentEffect || 3
})
const isLimit = ref(form.value.footer.links ? form.value.footer.links.length > 6 : false)
watch(form.value.footer.links, (val) => {
    isLimit.value = val.length > 5
})
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
    index !== -1 && appConfig.effect[3]?.cb()
    index !== undefined && appConfig.effect[index]?.cb()
}
const onColorPickerChange = (select?:boolean) => {
    root.style.setProperty('--el-color-primary', form.value.primaryColor)
}

const onClose = () => {
  emits('update:modelValue', false)
  resetForm(config)
}
const onReload = () => {
    if (form.value.apiUrl !== appConfig.apiUrl) {
        Loading({ text: '正在同步数据，请稍后...' })
        storage.removeItem('routes')
        if (router.currentRoute.value.path !== '/') {
            window.location.reload()
        } else {
            window.location.href = '/'
        }
        Loading().close()
    } else {
        Loading({ text: '正在保存设置，请稍后...' })
        setTimeout(() => {
        Loading().close()
            ElMessage.success('保存成功')
        }, 500);
        emits('update:modelValue', false)
    }
}
const onSubmit = () => {
    drawerFormRef.value?.validate((valid) => {
        if (!valid) {
            accordion.value = ['1', '2']
            return
        }
        emits('update:modelValue', false)
        setAppConfig({ ...form.value })
        onReload()
    })
}
const resetForm = (val?:any) => {
    form.value.primaryColor = val.primaryColor
    form.value.showBreadcrumb = val.showBreadcrumb
    form.value.currentEffect = val.currentEffect
    form.value.logoPosition = val.logoPosition
    form.value.baseUrl = val.baseUrl
    form.value.apiUrl = val.apiUrl
    form.value.footer = val.footer
}
const onReset = () => {
    ElMessageBox.confirm('重置操作会清空本地数据，恢复初始状态，确认重置？', '温馨提示').then(() => {
        resetForm(config)
        setAppConfig(config)
        onEffectChange(config.currentEffect)
        root.style.setProperty('--el-color-primary', config.primaryColor)
        onReload()
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
onEffectChange(form.value.currentEffect)
onColorPickerChange()
watch(appConfig, (val) => {
    resetForm(val)
})
</script>
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
    @close="onClose">
        <el-form class="web-setting-form" ref="drawerFormRef" :model="form" label-width="110px" :rules="rules">
            <el-collapse v-model="accordion">
                <el-collapse-item name="2" title="接口设置">
                    <el-form-item label="基础公共地址" prop="baseUrl">
                        <el-input placeholder="接口地址前缀，如：/api" v-model="form.baseUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="应用名称" prop="apiUrl">
                        <el-select v-model="form.apiUrl" style="width: 100%;margin-bottom: 5px;">
                            <el-option v-for="api in form.apiList" :label="api.name" :value="api.url" :key="api.name"></el-option>
                        </el-select>
                        <el-input style="width:45%" placeholder="链接名称" v-model="apiObj.name"></el-input>
                        <el-input style="margin-left: 5px;width:45%" placeholder="不存在跨域的或者项目中代理的地址" v-model="apiObj.url"></el-input>
                        <el-icon style="margin-left: 5px;cursor: pointer;" @click="form.apiList.push({ name: apiObj.name || apiObj.url, url: apiObj.url, id: form.apiList.length+1 });apiObj = {name: '', url: ''}"><Plus /></el-icon>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item name="1" title="基础设置">
                    <el-form-item label="主题色" prop="primaryColor" class="color-picker">
                        <el-color-picker style="width: 200px;" v-model="form.primaryColor" @change="() => onColorPickerChange(true)" show-alpha />
                        <span>{{ form.primaryColor }}</span>
                    </el-form-item>
                    <el-form-item label="特效" prop="currentEffect">
                        <el-select v-model="form.currentEffect" class="effect" style="width:100%;margin-right: 10px;" placeholder="特效" @change="(val:any) => onEffectChange(val, true)">
                            <el-option  :label="'无'" :value="-1"></el-option>
                            <el-option v-for="(item, index) in appConfig.effect" :label="item.name" :value="index" :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="logo位置" prop="logoPosition">
                        <el-radio-group v-model="form.logoPosition">
                            <el-radio :value="'top'" :label="'top'">头部</el-radio>
                            <el-radio :value="'bottom'" :label="'bottom'">侧边栏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="友情链接" prop="footer.links">
                        <el-form-item
                        v-for="(link, lindex) in form.footer.links"
                        :prop="'footer.links.'+ lindex +'.name'"
                        :rules="[{required: true, message: '友情链接不能为空', trigger: 'change'}]"
                        :key="lindex">
                            <el-input style="margin-bottom: 5px;width:82%" placeholder="链接名称" v-model="form.footer.links[lindex].name"></el-input>
                            <el-icon v-if="lindex !== form.footer.links.length - 1" style="margin-left: 5px;cursor: pointer;" @click="onLinksSort(lindex, 'down')"><SortDown /></el-icon>
                            <el-icon v-if="lindex" style="cursor: pointer;" @click="onLinksSort(lindex, 'up')"><SortUp /></el-icon>
                            <el-icon v-if="form.footer.links.length > 1" style="margin-left: 5px;cursor: pointer;" @click="form.footer.links.splice(lindex, 1)"><Delete /></el-icon>
                            <el-icon v-if="lindex === form.footer.links.length - 1 && !isLimit" style="margin-left: 5px;cursor: pointer;" @click="form.footer.links.push({name: '', href: '',  target: '_blank'})"><Plus /></el-icon>
                            <el-input style="margin-bottom: 5px" placeholder="链接地址" v-model="form.footer.links[lindex].href"></el-input>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="copyright" :rules="[{required: true, message: 'copyright不能为空'}]" prop="footer.copyright">
                        <el-input placeholder="copyright" v-model="form.footer.copyright"></el-input>
                    </el-form-item>
                    <el-form-item label="备案信息" :rules="[{required: true, message: '备案链接不能为空'}]" prop="footer.beian.href">
                        <el-input placeholder="备案链接" v-model="form.footer.beian.href"></el-input>
                    </el-form-item>
                    <el-form-item label="显示导航" prop="showBreadcrumb">
                        <el-switch v-model="form.showBreadcrumb"></el-switch>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="el-drawer__footer">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </el-drawer>
</template>