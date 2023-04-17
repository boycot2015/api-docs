<template>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        :collapse="collapse.isCollapse"
        @open="handleOpen"
        router
        unique-opened
        @close="handleClose"
    >
        <template v-for="item in routes as any" :key="item.path">
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length && !item.meta.hideChildren">
                <template #title>
                    <el-icon v-if="item.meta" ><component :is="item.meta.icon" /></el-icon>
                    <span>{{item.meta.title}}</span>
                </template>
                <el-menu-item  v-for="child in item.children" :key="child.path" :index="child.path">
                    <el-icon v-if="child.meta"><component  :is="child.meta.icon" /></el-icon>
                    <template #title v-if="child.meta">{{child.meta.title}}</template>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item :index="item.path" v-else-if="!item.meta.hideInMenu">
                <el-icon v-if="item.meta" ><component :is="item.meta.icon" /></el-icon>
                <template #title v-if="item.meta">{{item.meta.title}}</template>
            </el-menu-item>
        </template>
    </el-menu>
    <div class="logo" :style="{width: collapse.isCollapse? '60px': '200px'}" v-if="logoPosition">
        <p v-show="!collapse.isCollapse"><a href="/">{{$route.meta.websiteName}}</a></p>
        <el-icon :style="{margin: collapse.isCollapse ? '0': '0 0 0 20px'}" size="24"><Operation @click="collapse.toggleCollapse()" /></el-icon>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCollapseStore, useRouteStore } from '@/stores/app'
const router = useRouter()
let routeStore = useRouteStore()
// const activeIndex = reactive({ path : router.currentRoute.value.path || '/' })
const routes = computed(() => routeStore.routes)
const activeIndex = computed(() => {
    let path = router.currentRoute.value.path
   return path === '/home' ? '/' : path
})
const logoPosition = computed(() => {
    let websiteConfig:any = router.currentRoute.value.meta.websiteConfig
   return websiteConfig.logoPosition
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
    padding-bottom: 50px;
}
.logo {
    position: fixed;
    width: 200px;
    left: auto;
    bottom: 0;
    z-index: 1000;
    text-align: right;
    cursor: pointer;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--vt-c-white);
    border-top: 1px solid var(--el-menu-border-color);
    i {
        margin-left: 20px;
    }
    p a {
        font-size: 16px;
        font-weight: bold;
    }
}
</style>