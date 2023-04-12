<template>
  <el-breadcrumb :separator-icon="'ArrowRight'">
    <!-- :to="{ path: route.path }" -->
    <el-breadcrumb-item v-for="route in activeRoutes" :key="route.path">{{route.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<style lang="scss" scoped>
.el-breadcrumb {
    padding: var(--section-padding) 0 0 var(--section-padding);
    &-item {
        cursor: pointer;
    }
}
</style>
<script lang="ts" setup>
import {
    // ref,
    computed } from 'vue'
import { useRouter } from 'vue-router'
// import routes from '@/router/routes'
const router = useRouter()
const activeRoutes = computed(() => {
   return router.currentRoute.value.matched.filter((el:any) => !el.meta.hideChildren)
})
</script>