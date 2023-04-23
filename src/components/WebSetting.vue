<script lang="ts" setup>
import { useAppConfigStore } from '@/stores/app'
import { baseUrl } from '@/api/baseUrl'
import storage from '@/utils/storage'
import router from '@/router'
import Loading from '@/hooks/loading'
defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})
const { appConfig, setAppConfig } = useAppConfigStore()
const root:any = document.querySelector(':root')
const form = ref({
    color: appConfig.primaryColor || getComputedStyle(root).getPropertyValue('--el-color-primary'),
    showBreadcrumb: appConfig.showBreadcrumb,
    logoPosition: appConfig.logoPosition,
    baseUrl: appConfig.baseUrl || '',
    apiUrl: appConfig.apiUrl || baseUrl,
    currentEffect: appConfig.currentEffect || 3
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
    select && setAppConfig({ primaryColor: form.value.color, currentEffect:  index })
    if (index!== undefined && index < 0) return
    index !== -1 && appConfig.effect[3]?.cb()
    index !== undefined && appConfig.effect[index]?.cb()
}
const onColorPickerChange = (select?:boolean) => {
    root.style.setProperty('--el-color-primary', form.value.color)
    select && setAppConfig({ primaryColor: form.value.color })
}
const onBreadcrumbChange = () => {
    setAppConfig({ showBreadcrumb: form.value.showBreadcrumb })
}
const onPositionChange = () => {
    setAppConfig({ logoPosition: form.value.logoPosition })
}

const emits = defineEmits(['update:modelValue'])
const onClose = () => {
  emits('update:modelValue', false)
}
const onReload = () => {
    Loading()
    setTimeout(() => {
        Loading().close()
    }, 100);
    storage.removeItem('routes')
    if (router.currentRoute.value.path !== '/') {
        window.location.reload()
    } else {
        window.location.href = '/'
    }
}
const onSubmit = () => {
  emits('update:modelValue', false)
  onReload()
}
const onReset = () => {
    const config = {
        showBreadcrumb: true,
        currentEffect: 3,
        primaryColor: '#2458b3',
        logoPosition: 'top',
        baseUrl: '/',
        apiUrl: ''
    }
    form.value.color = config.primaryColor
    form.value.showBreadcrumb = config.showBreadcrumb
    form.value.currentEffect = config.currentEffect
    form.value.logoPosition = config.logoPosition
    form.value.baseUrl = config.baseUrl
    form.value.apiUrl = config.apiUrl
    setAppConfig(config)
    onEffectChange(config.currentEffect)
    root.style.setProperty('--el-color-primary', config.primaryColor)
    onReload()
}

onEffectChange(form.value.currentEffect)
onColorPickerChange()
watch(appConfig, (val) => {
    form.value.color = val.primaryColor
    form.value.showBreadcrumb = val.showBreadcrumb
    form.value.currentEffect = val.currentEffect
    form.value.logoPosition = val.logoPosition
    form.value.baseUrl = val.baseUrl
    form.value.apiUrl = val.apiUrl
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
.el-drawer__footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    border-top: 1px solid #f8f8f8;
}
</style>
<template>
    <el-drawer
    size="400"
    title="网站设置"
    ref="drawerRef"
    :lock-scroll="true"
    :append-to-body="true"
    :model-value="modelValue"
    @close="onClose">
        <el-form class="web-setting-form" :model="form" label-width="100px">
            <el-form-item label="主题色" class="color-picker">
                <el-color-picker style="width: 200px;" v-model="form.color" @change="() => onColorPickerChange(true)" show-alpha />
                <span>{{ form.color }}</span>
            </el-form-item>
            <el-form-item label="特效">
                <el-select v-model="form.currentEffect" class="effect" style="margin-right: 10px;" placeholder="特效" @change="(val:any) => onEffectChange(val, true)">
                    <el-option  :label="'无'" :value="-1"></el-option>
                    <el-option v-for="(item, index) in appConfig.effect" :label="item.name" :value="index" :key="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="显示导航">
                <el-switch @change="onBreadcrumbChange" v-model="form.showBreadcrumb"></el-switch>
            </el-form-item>
            <el-form-item label="logo位置">
                <el-radio-group v-model="form.logoPosition" @change="onPositionChange">
                    <el-radio :value="'top'" :label="'top'">头部</el-radio>
                    <el-radio :value="'bottom'" :label="'bottom'">侧边栏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="swagger地址">
                <el-input placeholder="不存在跨域的或者项目中代理的地址" @change="setAppConfig({ apiUrl: form.apiUrl })" v-model="form.apiUrl"></el-input>
            </el-form-item>
            <el-form-item label="基础公共地址">
                <el-input placeholder="接口地址前缀，如：/portal/web" @change="setAppConfig({ baseUrl: form.baseUrl })" v-model="form.baseUrl"></el-input>
            </el-form-item>
        </el-form>
        <div class="el-drawer__footer">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
    </el-drawer>
</template>