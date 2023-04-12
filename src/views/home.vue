<script setup lang="ts">
import { useAnchorStore } from '@/stores/app'
import { onMounted } from 'vue'
const appPageAnchors = useAnchorStore()
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
})
</script>
<template>
  <div class="home">
    <div class="logo">
        <el-image src="src/assets/image/logo.png"></el-image>
    </div>
    <div id="title">{{$route.meta.websiteName}}</div> <br>
  </div>
</template>
<style lang="scss" scoped>
.home {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    .logo {
        margin-bottom: 30px;
    }
}
</style>
