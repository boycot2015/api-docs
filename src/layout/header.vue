<template>
<div class="header">
    <div class="logo" :class="{'is-collapse': collapse.isCollapse}" v-if="$route.meta.websiteConfig && $route.meta.websiteConfig.logoPosition === 'top'">
       <a href="https://www.yunzhonghe.com" v-if="!collapse.isCollapse" target="_blank">{{$route.meta.websiteName}}</a>
        <el-icon size="24"><Operation @click="collapse.toggleCollapse()" /></el-icon>
    </div>
    <el-menu
        :default-active="activeIndex"
        class="el-header-menu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        router
        @select="handleSelect"
    >
        <template v-for="item in routes" :key="item.path">
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length">
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
            font-size: 20px;
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
    }
    .right {
        display: flex;
        align-items: center;
    }
}
</style>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCollapseStore, useRouteStore } from '@/stores/app'
import routes from '@/router/routes'
let routeStore = useRouteStore()
// const routes = computed(() => routeStore.routes.slice(0, 4))
const root:any = document.querySelector(':root')
const primaryColor = getComputedStyle(root).getPropertyValue('--el-color-primary')
const color = ref(primaryColor)
const collapse = useCollapseStore()
const router = useRouter()
const activeIndex = computed(() => {
   return router.currentRoute.value.path || '/'
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)

}
const onColorPickerChange = () => {
    root.style.setProperty('--el-color-primary', color.value)
}
</script>