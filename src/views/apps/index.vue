<script setup lang="tsx">
import { useAppsStore } from '@/stores/app'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

const appsStore = useAppsStore()
const router = useRouter()
const loading = ref(true)
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
watch(pageData, (val) => {})
onMounted(() => {})
</script>
<template>
  <div class="api-docs-app" key="api-docs-app" v-loading="loading">
  </div>
</template>
<style lang="scss">
.api-docs-app {
}
</style>