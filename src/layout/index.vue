<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Header from './header.vue'
import Aside from './aside.vue'
import Breadcrumb from './breadcrumb.vue'
import Anchor from './anchor.vue'
import { useAnchorStore, useCollapseStore, useAppConfigStore } from '@/stores/app'
const appConfigStore = useAppConfigStore()
const router = useRouter()
const appConfig = computed(() => appConfigStore.appConfig) as any
const showBreadcrumb = ref(appConfig.value.showBreadcrumb)
const scrollRef:any = ref(null)
const appPageAnchors = useAnchorStore()
const collapse = useCollapseStore()
watch(appConfig, (val) => {
    showBreadcrumb.value = val.showBreadcrumb && !router.currentRoute.value.meta.hideBreadcrumb
    computedStyle()
})
const styles = ref({})
watch(router.currentRoute, () => {
    if (scrollRef.value && scrollRef.value) {
        scrollRef.value.scrollTop = 0
        appPageAnchors.setAnchorIndex(0)
    }
})
const getOffset = (el:any) => {
    let scrollTop = el.offsetTop
    let current = el.offsetParent
    while (current !== null) {
        scrollTop += current.offsetTop
        current = current.offsetParent
    }
    return scrollTop - 150
}
const computedStyle:any|undefined = (autoWidth?:boolean) => {
    const { hideHeader } = router.currentRoute.value.meta  as any
    styles.value = { height: !hideHeader ? (showBreadcrumb.value ? 'calc(100vh - 152px)':'calc(100vh - 122px)') : showBreadcrumb.value ? 'calc(100vh - 102px)': 'calc(100vh - 69px)', width: collapse.isCollapse ? 'calc((90vw - 64px)' : '',overflowX: collapse.isCollapse ? 'auto': '' }
}
const setAnchorIndex = (e?:any) => {
    let scrollTop = e && e.target ? Math.floor(e.target.scrollTop) : window.scrollY
    let achorIndex = 0
    appPageAnchors.anchors.forEach((el: any, index: number) => {
        if (scrollTop > Math.abs(getOffset(el))) {
            achorIndex = index
        }
    })
    window.scrollTo(0, 0)
    appPageAnchors.setAnchorIndex(achorIndex)
}
const toggleCollapse = (e?:any) => {
    let innerWidth = e && e.target ? Math.floor(e.target.innerWidth) : window.innerWidth
    if (innerWidth <= 1200) {
        collapse.toggleCollapse(true)
    } else {
        collapse.toggleCollapse(false)
    }
    computedStyle(innerWidth <= 1200)
}
onMounted(() => {
    setAnchorIndex()
    toggleCollapse()
    computedStyle()
    scrollRef.value.addEventListener('scroll', setAnchorIndex)
    window.addEventListener('resize', toggleCollapse)
})
</script>
<template>
    <div class="layout">
        <el-container>
            <el-header v-if="!$route.meta.hideHeader"><Header /></el-header>
            <el-container>
                <el-aside :style="{height: !$route.meta.hideHeader ? '': '100vh'}" :width="collapse.isCollapse ? '65px': '200px'" v-if="!$route.meta.hideAside"><Aside /></el-aside>
                <el-main>
                    <Breadcrumb v-if="showBreadcrumb"></Breadcrumb>
                    <div class="body" ref="scrollRef" :style="styles">
                        <RouterView v-slot="{ Component }">
                            <Transition name="slide-fade" mode="out-in">
                                <keep-alive :include="[]">
                                    <component :is="Component"></component>
                                </keep-alive>
                            </Transition>
                        </RouterView>
                        <Anchor v-if="$route.meta.showAnchor" />
                    </div>
                </el-main>
            </el-container>
            <!-- <el-footer>Footer</el-footer> -->
        </el-container>
        <el-backtop target=".body" style="zIndex: 999;box-shadow: 0 0 30px #999;" :right="70" :bottom="80" />
    </div>
</template>

<style lang="scss" scoped>
#api-docs .layout {
    width: 100%;
    // height: 100vh;
    overflow: hidden;
}
.el-header {
    width: 100%;
    padding: 0;
    height: 58px;
    // background-color: var(--vt-c-black-mute);
    background-image: radial-gradient(transparent 1px,var(--bg-color) 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    background-color: var(--vt-c-white);
    box-shadow: 0 5px 15px var(--vt-c-ccc);
}
.el-aside {
    height: calc(100vh - 58px);
    border-right: solid 1px var(--el-menu-border-color);
    transition: width .3s;
    z-index: 2;
    background-color: var(--vt-c-white);
}
.el-aside {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100vh - 58px);
    box-shadow: 0 0 15px var(--vt-c-ccc);
}
.el-container {
    background-color: var(--vt-c-white-soft);
    .el-container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
.el-main {
    /* overflow: auto; */
    padding: 0;
    overflow-x: hidden;
    background-color: var(--vt-c-white-soft);
    .body {
        position: relative;
        margin: var(--section-padding);
        // margin-right: 20px;
        // border: 16px solid var(--vt-c-white-soft);
        padding: var(--section-padding);
        background-color: var(--vt-c-white);
        // max-width: calc(100vw - 220px);
        // max-width: 1200px;
        // min-width: 800px;
        display: flex;
        // overflow: hidden;
        overflow: auto;
        box-sizing: border-box;
        border-radius: var(--border-radius);
        box-shadow: 0 0 15px var(--vt-c-ccc);
    }
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: none;
//   transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
