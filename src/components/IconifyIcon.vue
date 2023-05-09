<script setup lang="ts" name="IconifyIcon">
import { Icon, iconExists, loadIcons } from '@iconify/vue';
import type { CSSProperties } from "vue";

interface IconifyProps {
  name: string; // 图标的名称 ==> 必传
  color?: string; // 图标的颜色 ==> 非必传
  iconStyle?: CSSProperties; // 图标的样式 ==> 非必传
}
const props = withDefaults(defineProps<IconifyProps>(), {
    iconStyle: () => ({ width: "20px", height: "20px" }),
});
// Variable to store function to cancel loading
const loader = ref();
// Icon status
const loaded = ref(false);

// Function to check if icon data is available
const check = (icon: string) => {
    const isLoaded = (loaded.value = iconExists(icon));

    // Cancel old loder
    if (loader.value) {
        loader.value();
        loader.value = null;
    }
    if (!isLoaded) {
        loader.value = loadIcons([icon], () => {
            loaded.value = iconExists(icon);
        })
    }
}
check(props.name)
</script>

<template>
  <Icon :icon="props.name" v-if="loaded" :color="props.color" :style="props.iconStyle" />
  <span v-else> {{ props.name }}</span>
</template>

<style>
svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>