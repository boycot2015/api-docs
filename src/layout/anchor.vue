<template>
  <div class="anchor" :class="activeIndex===anchors.length && 'hide'" v-show="anchors && anchors.length">
    <div class="wrapper">
        <a class="anchor-item" @click="setAnchorIndex(index)" :class="{'is-active': index === activeIndex}" v-for="(item, index) in anchors" :href="'#' + item.className.split(' ')[0] + index" :key="item.innerText">{{item.innerText}}</a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.anchor {
    position: fixed;
    top: auto;
    left: auto;
    right: 130px;
    bottom: auto;
    z-index: 9;
    min-width: 150px;
    box-shadow: 0 10px 50px #ccc;
    background-color: var(--vt-c-white);
    opacity: 1;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    transition: all .3s;
    overflow: hidden;
    &.hide {
        height: 0;
        opacity: 0;
        width: 0;
    }
    .wrapper {
        width: 100%;
        max-height: 300px;
        border-left: 2px solid var(--vt-c-black-light);
        padding: 16px 0;
        overflow-y: auto;
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
import { useRouter } from 'vue-router'
import { useAnchorStore } from '@/stores/app'
interface ElProp {
    className: string
    innerText: string
}
const router = useRouter()
const appPageAnchors = useAnchorStore()
const activeIndex = computed(() => appPageAnchors.anchorIndex)
const anchors = computed<ElProp[]>(() => appPageAnchors.anchors)
watch(router.currentRoute, (to, from) => {
    if (to.path !== from.path) {
        appPageAnchors.setAnchorIndex(0)
        // appPageAnchors.setAnchor([])
        // console.log(activeIndex, 'activeIndex');
    }
})
const setAnchorIndex = (index:number) => {
    appPageAnchors.setAnchorIndex(index)
}
</script>