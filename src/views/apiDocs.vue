<script setup lang="ts">
import { useAnchorStore } from '@/stores/app'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
const router = useRouter()
const appPageAnchors = useAnchorStore()
// console.log(router.currentRoute.value, 'currentRoute');
const pageData:any = computed(() => router.currentRoute.value.meta.pageData)
const state = computed(() => (
    {
    data: pageData.value.data,
    url: pageData.value.url,
    method: pageData.value.method,
    inColumns: [
        { prop: 'name', label: '参数名称', width: 100 },
        { prop: 'type', label: '类型', width: 100 },
        { prop: 'in', label: '传递位置', width: 100 },
        { prop: 'required', label: '是否必传', width: 100 },
        { prop: 'description', label: '说明', width: 100 },
    ],
    outColumns: [
        { prop: 'name', label: '参数名称', width: 100 },
        { prop: 'type', label: '类型', width: 100 },
        { prop: 'in', label: '传递位置', width: 100 },
        { prop: 'required', label: '是否必传', width: 100 },
        { prop: 'description', label: '说明', width: 100 },
    ],
    name: pageData.value.name
}
))
onMounted(() => {
    appPageAnchors.setAnchor(document.querySelectorAll('.app-page-anchor'))
})
</script>
<template>
  <div class="apiDocs">
    <h1 class="tc title">{{state.name}}</h1>
    <div class="api-desc">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor0">1. 接口说明</h3>
        <div class="api-desc-item">
            <div class="name">1.1 接口请求地址</div>
            <div class="value">[{{state.method}}]{{state.url}}</div>
        </div>
        <div class="api-desc-item">
            <div class="name">1.2 接口描述</div>
            <div class="value">{{state.data.description}}</div>
        </div>
    </div>
    <div class="in-params">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor1">2. 输入参数</h3>
        <el-table
        :data="state.data.parameters"
        >
            <el-table-column
            :prop="column.prop"
            v-for="column in state.inColumns"
            :key="column.prop"
            :label="column.label"></el-table-column>
        </el-table>
    </div>
    <div class="out-params">
        <h3 class="app-page-anchor sub-title" id="app-page-anchor2">3. 输出参数</h3>
        <el-table
        :data="state.data.parameters"
        >
            <el-table-column
            :prop="column.prop"
            v-for="column in state.inColumns"
            :key="column.prop"
            :label="column.label"></el-table-column>
        </el-table>
    </div>
    {{state.data.responesparameters}}
  </div>
</template>
<style lang="scss" scoped>
.apiDocs {
    padding: 30px 0;
    .title {
        font-size: 32px;
        // font-weight: bold;
        line-height: 32px;
        margin-bottom: 30px;
    }
    .sub-title {
        margin: 0;
    }
}
</style>