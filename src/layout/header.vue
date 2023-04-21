<template>
<div class="header">
    <slot name="logo">
        <div class="logo" :class="{'is-collapse': collapse.isCollapse }" v-if="appConfig.logoPosition === 'top'">
            <RouterLink class="title" to="/" v-if="!collapse.isCollapse">{{appConfig.websiteName}}</RouterLink>
            <el-icon size="24"><Operation @click="collapse.toggleCollapse()" /></el-icon>
        </div>
    </slot>
    <el-menu
        :default-active="activeIndex"
        class="el-header-menu"
        mode="horizontal"
        background-color="#000000"
        text-color="#fff"
        router
        :style="appConfig.logoPosition === 'bottom' && activeIndex!=='/' ? 'width: 800px': ''"
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
        <Search style="margin-right: 10px;"></Search>
        <div class="setting" @click="toggleVisible(true)">
            <el-icon><Setting /></el-icon>
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
    width: 1200px;
    margin: 0 auto;
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
            color: var(--el-menu-border-color);
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
        .setting {
            font-size: 26px;
            cursor: pointer;
            line-height: 100%;
            color: var(--vt-c-white);
        }
    }
}
</style>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCollapseStore, useRouteStore, useAppConfigStore } from '@/stores/app'
import WebSetting from '@/components/WebSetting.vue'
import Search from '@/components/Search.vue'
import useState from '@/hooks/useState'
const [ visible, toggleVisible ] = useState(false)
let routeStore = useRouteStore()
const collapse = useCollapseStore()
const router = useRouter()
const appConfigStore = useAppConfigStore()
const appConfig = computed(() => appConfigStore.appConfig) as any
const routes = computed(() => routeStore.routes.filter((el:any) => el.meta?.showInHeader))
const activeIndex = computed(() => {
    let path = router.currentRoute.value.path
   return path === '/home' ? '/' : path
})
const handleSelect = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)

}
</script>