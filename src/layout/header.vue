<template>
<div class="header" :style="{maxWidth: showMenu ? '1200px': '1150px'}">
    <slot name="logo">
        <!-- :class="{'is-collapse': collapse.isCollapse }" -->
        <div class="logo" v-if="appConfig.logoPosition === 'top' && showMenu">
            <!-- v-if="!collapse.isCollapse" -->
            <RouterLink class="title" to="/">{{appConfig.websiteName}}</RouterLink>
            <el-icon :size="24" v-if="showMenu"><IconifyIcon name="ep:operation" :iconStyle="{ }" @click="collapse.toggleCollapse()" /></el-icon>
        </div>
        <div class="logo" v-if="!showMenu">
            <!-- v-if="!collapse.isCollapse" -->
            <img :src="logo" alt="">
        </div>
    </slot>
    <el-menu
        v-if="showMenu"
        :default-active="activeIndex"
        class="el-header-menu"
        mode="horizontal"
        background-color="#fff"
        text-color="#333"
        router
        :style="appConfig.logoPosition === 'bottom' && activeIndex!=='/' ? 'width: 880px': ''"
    >
        <template v-for="item in routes.slice(0,20)" :key="item.path">
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length && !item.meta.hideChildren">
                <template #title>
                    <el-icon v-if="item.meta && item.meta.icon"><IconifyIcon :name="item.meta.icon" /></el-icon>
                    <!-- <el-icon v-else>{{ item.name.slice(0,2).toUpperCase() }}</el-icon> -->
                    <span :title="item.meta.title">{{ getMenuTitleStr(item.meta.title) }}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                    <el-icon v-if="child.meta && child.meta.icon"><IconifyIcon :name="child.meta.icon" /></el-icon>
                    <template #title v-if="child.meta"><span :title="child.meta.title">{{child.meta?.title}}</span></template>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item :index="item.path" v-else>
                <template #title v-if="item.meta">
                    <el-icon v-if="item.meta && item.meta.icon"><IconifyIcon :name="item.meta.icon" /></el-icon>
                    <span :title="item.meta.title">{{ getMenuTitleStr(item.meta.title) }}</span>
                </template>
            </el-menu-item>
        </template>
    </el-menu>
    <div class="right" :class="{ 'centered' : !showMenu }">
        <Search style="margin-right: 10px;"></Search>
        <div class="setting" @click="toggleVisible(true)">
            <el-icon :size="40"><IconifyIcon name="ep:setting" :iconStyle="{ }" /></el-icon>
        </div>
        <WebSetting v-model="visible"></WebSetting>
    </div>
</div>
</template>
<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    height: 58px;
    background-image: radial-gradient(transparent 1px,var(--bg-color) 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    background-color: var(--vt-c-white);
    .logo {
        flex-basis: 200px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // flex-wrap: nowrap;
        .title {
            flex-basis: 140px;
        }
        i {
            color: var( --vt-c-black);
        }
        a {
            font-size: 18px;
            font-weight: bold;
        }
        &.is-collapse {
            flex-basis: 70px;
            text-align: center;
            display: inline-block;
        }
        img {
            margin: 0 auto;
            width: 100px;
        }
    }
    .el-header-menu {
        width: 640px;
        // max-width: 700px;
        border-bottom: 0;
    }
    .right {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &.centered {
            width: 100%;
            padding: 0 25px;
            box-sizing: border-box;
        }
        .setting {
            font-size: 26px;
            cursor: pointer;
            line-height: 100%;
            color: var(--vt-c-black);
        }
    }
}
</style>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCollapseStore, useRouteStore, useAppConfigStore } from '@/stores/app'
import useState from '@/hooks/useState'
import type { RouteProps } from '@/router'
import logo from '@/assets/image/logo.png'
import { getMenuTitleStr } from '@/utils' 
const [ visible, toggleVisible ] = useState(false)
let routeStore = useRouteStore()
const collapse = useCollapseStore()
const router = useRouter()
const appConfigStore = useAppConfigStore()
const appConfig = computed(() => appConfigStore.appConfig) as any
const activeIndex = computed(() => {
    let path = router.currentRoute.value.path    
    let hideChildren = router.currentRoute.value.meta.hideChildren
    let matched = router.currentRoute.value.matched
    return path === '/home' ? '/' : hideChildren ? matched[0].path : path
})
const routes = computed<RouteProps[]>(() => routeStore.routes.filter((el:any) => el.meta?.showInHeader || (routeStore.routes.length < 10 && el.meta?.affix)))

const showMenu = ref(true)
const toggleShow = (e?:any) => {
    let innerWidth = e && e.target ? Math.floor(e.target.innerWidth) : window.innerWidth
    if (innerWidth <= 1200) {
        showMenu.value = false
    } else {
        showMenu.value = true
    }
}
onMounted(() => {
    toggleShow()
    window.addEventListener('resize', toggleShow)
})
</script>