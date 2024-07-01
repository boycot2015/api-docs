<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const localLanguage = computed(() => zhCn)
</script>
<template>
    <el-config-provider :locale="localLanguage" size="default" :zIndex="3000">
        <RouterView></RouterView>
    </el-config-provider>
</template>

<style scoped>
</style>
