<template>
  <el-breadcrumb>
    <el-breadcrumb-item v-for="(route, index) in activeRoutes"
    :key="route.path + index">{{route.meta.title}}</el-breadcrumb-item>
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
<script lang="tsx" setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
// import routes from '@/router/routes'
const router = useRouter()
const activeRoutes = computed(() => {
   return router.currentRoute.value.matched.filter((el:any) => !el.meta.hideChildren && !el.meta.hideInMenu).slice(-2)
})
// const separatorIcon = '>'
// const separatorIcon:any = <el-icon ><Icon icon="ep:arrow-right" /></el-icon>
</script>