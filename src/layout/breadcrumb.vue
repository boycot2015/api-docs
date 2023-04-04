<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: activeRoute.path }">{{activeRoute.meta.title}}</el-breadcrumb-item>
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
const activeRoute = computed(() => {
   return router.currentRoute.value
})
import { ArrowRight } from '@element-plus/icons-vue'
</script>