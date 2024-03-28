<template>
  <div class="log" v-loading="loading">
    <h2 class="title">更新日志</h2>
    <div class="list">
        <div class="list-item" v-for="(item, index) in logs">
            <div class="app-page-anchor" :id="`app-page-anchor${index}`">{{ new Date(item.committer.date).toLocaleString() }}</div>
            <div class="username">提交人：{{ item.committer.email }}</div>
            <div class="content">内容：{{ item.message }}</div>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAnchorStore, useAppConfigStore } from '@/stores/app'
import axios from 'axios'
interface InfoProps {
    name:string
    date:Date
    email:string
}
interface LogProps {
    committer: InfoProps
    author:InfoProps
    message:string
    url:string
}
const appPageAnchors = useAnchorStore()
const { appConfig } = useAppConfigStore()
const { gitConfig } = appConfig
const logs = ref<LogProps[]>([])
const loading = ref(true)
const getData = () => {
    loading.value = true
    axios.get(`https://gitee.com/api/v5/repos/${gitConfig.owner}/${gitConfig.repo}/commits`, {
        params: {
            access_token: gitConfig.access_token,
            page: 1,
            per_page: 100
        }
    }).then((res:any) => {
        loading.value = false
        logs.value = res.data.map((el:any) => el.commit)
        setTimeout(() => {
            appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
            appPageAnchors.setAnchorIndex(0)
        }, 100);
    })
}
onMounted(() => {
    getData()
})
</script>
<style>
/* @media (min-width: 1024px) {
  .about {
    display: flex;
  }
} */
.app-page-anchor {
    font-weight: bold;
}
.log {
    width: calc(100vw - 200px);
}
.list {
    padding-bottom: 20px;
}
</style>
