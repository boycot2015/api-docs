<template>
    <el-menu
        :default-active="activeIndex"
        class="el-header-menu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="hsla(160, 100%, 37%, 1)"
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
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import routes from '@/router/routes'
const router = useRouter()
const activeIndex = computed(() => {
   return router.currentRoute.value.path || '/'
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>