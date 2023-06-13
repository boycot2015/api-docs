<template>
    <el-image
    :fit="props.fit"
    :src="props.src"
    :alt="props.alt"
    :preview-src-list="props.previewList"
    :z-index="props['z-index']"
    :initial-index="props['initial-index']"
    preview-teleported
    :scroll-container="props['scroll-container']" lazy>
        <template #placeholder>
            <slot name="placeholder">
                <div class="flexbox-v align-c image-slot">
                    <el-icon><icon-loading /></el-icon>
                    <span class="text">加载中...</span>
                </div>
            </slot>
        </template>
        <template #error>
            <slot name="error">
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
            </slot>
        </template>
    </el-image>
</template>
<script setup>
import { Picture as IconPicture, Loading as IconLoading } from '@element-plus/icons-vue'
const props = defineProps(['fit', 'src', 'alt', 'scroll-container', 'previewList', 'z-index', 'initial-index', 'compress'])
</script>