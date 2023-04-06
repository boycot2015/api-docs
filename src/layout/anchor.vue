<template>
  <div class="anchor" v-if="anchors && anchors.length">
    <div class="wrapper">
        <a class="anchor-item" @click="setAnchorIndex(index)" :class="{'is-active': index === activeIndex}" v-for="(item, index) in anchors" :href="'#' + item.className + index" :key="item">{{item.innerText}}</a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.anchor {
    position: fixed;
    right: 40px;
    min-width: 150px;
    margin-left: 10px;
    border-left: 2px solid var(--vt-c-black-light);
    background-color: var(--vt-c-white);
    .wrapper {
        height: auto;
        padding: 16px 0;
        box-shadow: 0 10px 30px #ccc;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }
    &-item {
        display: block;
        margin-bottom: 8px;
        margin-left: -2px;
        font-size: 14px;
        line-height: 20px;
        color: var(--vt-c-black);
        border-left: 2px solid transparent;
        padding: 5px 0 5px 10px;
        &.is-active {
            color: var(--el-color-primary);
            border-left: 2px solid var(--el-color-primary);
            background-color: var(--vt-c-text-dark-2);
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAnchorStore } from '@/stores/app'
const router = useRouter()
const appPageAnchors = useAnchorStore()
const activeIndex = computed(() => appPageAnchors.anchorIndex)
const anchors = computed(() => appPageAnchors.anchors)
watch(router.currentRoute, (to, from) => {
    if (to.path !== from.path) {
        appPageAnchors.setAnchorIndex(0)
        appPageAnchors.setAnchor([])
    }
})
const setAnchorIndex = (index:number) => {
    appPageAnchors.setAnchorIndex(index)
}
</script>