<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Header from '@/layout/header.vue'
import Aside from '@/layout/aside.vue'
import Breadcrumb from '@/layout/breadcrumb.vue'
import Anchor from '@/layout/anchor.vue'
import { watch, ref, onMounted, computed } from 'vue'
import { useAnchorStore } from '@/stores/app'
const router = useRouter()
const scrollRef:any = ref(null)
let scrollPage:any = ref(null)
const appPageAnchors = useAnchorStore()
// scrollPage = document.querySelector('.el-main')
watch(router.currentRoute, () => {
    if (scrollRef.value && scrollRef.value) {
        scrollRef.value.scrollTop = 0
    }
})
const getOffset = (el:any) => {
    let scrollTop = el.offsetTop
    let current = el.offsetParent
    while (current !== null) {
        scrollTop += current.offsetTop
        current = current.offsetParent
    }
    return scrollTop - 100
}
const computedStyle = computed(() => {
    const { hideHeader, websiteConfig = {}  } = router.currentRoute.value.meta  as any
    const { showBreadcrumb } = websiteConfig
    return { height: !hideHeader ? (showBreadcrumb ? 'calc(100vh - 126px)':''): showBreadcrumb ? 'calc(100vh - 66px)': 'calc(100vh - 36px)' }
})
onMounted(() => {
    scrollRef.value.addEventListener('scroll', (e:any) => {
        let scrollTop = e.target.scrollTop.toFixed(0)
        let achorIndex = 0
        appPageAnchors.anchors.forEach((el: any, index: number) => {
            if (scrollTop >= getOffset(el)) {
                achorIndex = index
            }
        })
        appPageAnchors.setAnchorIndex(achorIndex)
    })
})
</script>
<template>
    <div class="layout">
        <el-container>
            <el-header v-if="!$route.meta.hideHeader"><Header /></el-header>
            <el-container>
                <el-aside :style="{height: !$route.meta.hideHeader ? '': '100vh'}" width="200" v-if="!$route.meta.hideAside"><Aside /></el-aside>
                <el-main>
                    <Breadcrumb v-if="$route.meta.websiteConfig && $route.meta.websiteConfig.showBreadcrumb"></Breadcrumb>
                    <div class="body" ref="scrollRef" :style="computedStyle">
                        <RouterView v-slot="{ Component }">
                            <Transition name="slide-fade" mode="out-in">
                                <component :is="Component" />
                            </Transition>
                        </RouterView>
                        <Anchor v-if="!$route.meta.hideAnchor" />
                    </div>
                </el-main>
            </el-container>
            <!-- <el-footer>Footer</el-footer> -->
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
.layout {
    width: 100%;
}
.el-header {
    width: 100%;
    padding: 0;
    height: 58px;
    background-color: #545c64;
}
.el-aside {
    border-right: solid 1px var(--el-menu-border-color);
}
.el-aside {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100vh - 58px);
}

.el-main {
    /* overflow: auto; */
    padding: 0;
    background-color: var(--vt-c-white-soft);
    .body {
        margin: var(--section-padding);
        // border: 16px solid var(--vt-c-white-soft);
        padding: var(--section-padding);
        background-color: var(--vt-c-white);
        min-width: 800px;
        // max-width: 1200px;
        display: flex;
        overflow: hidden;
        overflow-y: auto;
        height: calc(100vh - 98px);
        border-radius: var(--border-radius);
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
