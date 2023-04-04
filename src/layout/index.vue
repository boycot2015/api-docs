<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/layout/header.vue'
import Aside from '@/layout/aside.vue'
import Breadcrumb from '@/layout/breadcrumb.vue'
import { ref } from 'vue'
const isCollapse = ref(false)
const collapseChange = (val:boolean) => {
    isCollapse.value = val
}
</script>
<template>
    <div class="layout">
        <el-container>
            <el-header><Header /></el-header>
            <el-container>
                <el-aside :width="!isCollapse ? '200' : '60'"><Aside @collapse="val => isCollapse = val" /></el-aside>
                <el-main>
                    <Breadcrumb></Breadcrumb>
                    <div class="body">
                        <Transition name="slide-fade">
                            <RouterView />
                        </Transition>
                    </div>
                </el-main>
            </el-container>
            <!-- <el-footer>Footer</el-footer> -->
        </el-container>
    </div>
</template>

<style scoped>
.layout {
    width: 100%;
}
.el-header {
    width: 100%;
    padding: 0;
    background-color: var(--el-menu-bg-color);
}
.el-aside {
    border-right: solid 1px var(--el-menu-border-color);
}
.el-container .el-container,
.el-aside {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100vh - 68px);
}

.el-main {
    /* overflow: auto; */
    padding: 0;
    background-color: var(--vt-c-white-soft);
}
.el-main .body {
    margin: var(--section-padding);
    padding: var(--section-padding);
    background-color: var(--vt-c-white);
    min-width: 1200px;
    border-radius: var(--border-radius);
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
