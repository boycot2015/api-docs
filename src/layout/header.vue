<template>
<div class="header">
    <slot name="logo">
        <div class="logo" :class="{'is-collapse': collapse.isCollapse }">
            <template v-if="config && config.logoPosition === 'top'">
                <a href="/" v-if="!collapse.isCollapse">{{config.websiteName}}</a>
                    <el-icon size="24"><Operation @click="collapse.toggleCollapse()" /></el-icon>
            </template>
        </div>
    </slot>
    <el-menu
        :default-active="activeIndex"
        class="el-header-menu"
        mode="horizontal"
        background-color="#000000"
        text-color="#fff"
        router
        @select="handleSelect"
    >
        <template v-for="item in routes as any" :key="item.path">
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length && !item.meta.hideChildren">
                <template #title><span>{{item.meta.title}}</span></template>
                <el-menu-item  v-for="child in item.children" :key="child.path" :index="child.path">
                    <el-icon v-if="child.meta"><component  :is="child.meta.icon" /></el-icon>
                    <template #title v-if="child.meta">{{child.meta.title}}</template>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item :index="item.path" v-else>
                <el-icon v-if="item.meta" ><component :is="item.meta.icon" /></el-icon>
                <template #title v-if="item.meta">{{item.meta.title}}</template>
            </el-menu-item>
        </template>
    </el-menu>
    <div class="right">
        <el-select v-model="currentEffect" class="el-effects" style="margin-right: 10px;" placeholder="特效" @change="onEffectChange">
            <el-option  :label="'无'" :value="-1"></el-option>
            <el-option v-for="(item, index) in effect" :label="item.name" :value="index" :key="item.name"></el-option>
        </el-select>
        <el-color-picker class="color-picker" v-model="color" @change="onColorPickerChange" show-alpha />
    </div>
</div>
</template>
<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 16px;
    width: 1200px;
    margin: 0 auto;
    .logo {
        width: 200px;
        text-align: center;
        cursor: pointer;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        i {
            color: var(--el-menu-border-color);
        }
        a {
            font-size: 18px;
            font-weight: bold;
        }
        &.is-collapse {
            width: 60px;
            padding: 0;
        }
    }
    .el-header-menu {
        // width: 800px;
        flex: 1;
        // margin: 0 auto;
        border-bottom: 0;
    }
    .right {
        display: flex;
        align-items: center;
    }
}
</style>
<script lang="tsx" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCollapseStore, useRouteStore } from '@/stores/app'
import config from '@/config'
import effect from '@/plugins/specialEffects.js'
const currentEffect = ref(0)
const onEffectChange = (index?:number) => {
    window.onclick = null
    window.onmousedown = null
    window.onmouseup = null
    const canvas:HTMLCanvasElement = document.querySelector('body > canvas') as any
    if (canvas !== null) {
        canvas.parentNode?.removeChild(canvas);
    }
    !index && effect[3]?.cb()
    effect[index]?.cb()
}
onEffectChange(0)
let routeStore = useRouteStore()
// const routes = computed(() => routeStore.routes.slice(0, 4))
const root:any = document.querySelector(':root')
const primaryColor = getComputedStyle(root).getPropertyValue('--el-color-primary')
const color = ref(primaryColor)
const collapse = useCollapseStore()
const router = useRouter()

const routes = computed(() => routeStore.routes.filter((el:any) => el.meta.showInHeader))
const activeIndex = computed(() => {
    let path = router.currentRoute.value.path
   return path === '/home' ? '/' : path
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)

}
const onColorPickerChange = () => {
    root.style.setProperty('--el-color-primary', color.value)
}
</script>