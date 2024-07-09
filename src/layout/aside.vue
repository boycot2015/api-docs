<template>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        :collapse="collapse.isCollapse"
        @open="handleOpen"
        router
        :style="appConfig.logoPosition === 'bottom'?'padding-bottom:55px':''"
        unique-opened
        @close="handleClose"
    >
        <template v-for="item in routes" :key="item.path">
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length && !item.meta.hideChildren">
                <template #title>
                    <el-icon v-if="item.meta && item.meta.icon" ><IconifyIcon :name="item.meta.icon" /></el-icon>
                    <span class="line-clamp1" :title="item.meta.title" v-if="item.meta.title">{{ getMenuTitleStr(item.meta.title) }}</span>
                </template>
                <el-menu-item  v-for="child in item.children" :key="child.path" :index="child.path" v-show="child.meta && !child.meta.hideInMenu">
                    <el-icon v-if="child.meta && child.meta.icon" ><IconifyIcon :name="child.meta.icon" /></el-icon>
                    <template #title v-if="child.meta && child.meta.title"><span :title="child.meta.title">{{ getMenuTitleStr(child.meta.title, 8) }}</span></template>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item :index="item.path" v-else-if="item.meta && !item.meta.hideInMenu">
                <el-icon v-if="item.meta && item.meta.icon" ><IconifyIcon :name="item.meta.icon" /></el-icon>
                <el-icon v-else-if="item.meta && item.meta.title">{{ item.meta.title.slice(0,2).toUpperCase() }}</el-icon>
                <template #title v-if="item.meta && item.meta.title"><span class="line-clamp1" :title="item.meta.title">{{ getMenuTitleStr(item.meta.title) }}</span></template>
            </el-menu-item>
        </template>
    </el-menu>
    <div class="logo" :style="{width: collapse.isCollapse? '24px': '160px'}" v-if="appConfig.logoPosition === 'bottom'">
        <p v-show="!collapse.isCollapse" class="tc"><RouterLink to="/">{{appConfig.websiteName}}</RouterLink></p>
        <!-- <el-icon :style="{margin: collapse.isCollapse ? '0': '0 0 0 20px'}" size="24"><Operation @click="collapse.toggleCollapse()" /></el-icon> -->
        <el-icon :style="{margin: collapse.isCollapse ? '0': '0 0 0 20px'}" size="24"><IconifyIcon name="ep:operation" :iconStyle="{ }" @click="collapse.toggleCollapse()" /></el-icon>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import type { RouteProps } from '@/router'
import { getMenuTitleStr } from '@/utils' 
import { useCollapseStore, useRouteStore, useAppConfigStore } from '@/stores/app'
const router = useRouter()
let routeStore = useRouteStore()
const appConfigStore = useAppConfigStore()
const appConfig = computed(() => appConfigStore.appConfig) as any
// const activeIndex = reactive({ path : router.currentRoute.value.path || '/' })
const routes = computed<RouteProps[]>(() => routeStore.routes)
const activeIndex = computed(() => {
    let path = router.currentRoute.value.path
    let hideChildren = router.currentRoute.value.meta.hideChildren
    let matched = router.currentRoute.value.matched
    return path === '/home' ? '/' : hideChildren ? matched[0].path : path
})
const collapse = useCollapseStore()
const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.el-menu-vertical {
    min-height: 400px;
    border-right: none;
    &:not(.el-menu--collapse) {
        width: 200px;
    }
}
.logo {
    position: fixed;
    width: 200px;
    left: auto;
    bottom: 0;
    z-index: 1000;
    text-align: right;
    cursor: pointer;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--vt-c-white);
    border-top: 1px solid var(--el-menu-border-color);
    p {
        margin: 0;
    }
    i {
        margin-left: 20px;
    }
    p a {
        font-size: 16px;
        font-weight: bold;
    }
}
</style>