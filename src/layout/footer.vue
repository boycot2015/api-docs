<template>
    <div class="foot_nav" v-if="appConfig.footer">
        <footer>
            <div class="footer">
                <div class="inner">
                    友情链接：
                    <span class="text_left" v-for="link in appConfig.footer.links" :key="link.name">
                        <a :href="link.href" :target="link.target">{{link.name}}&nbsp;&nbsp;</a>
                    </span>
                    <span class="text_right">
                        <span v-if="appConfig.footer.copyright">Copyright©{{appConfig.footer.copyright}}&nbsp;&nbsp;</span>
                        <a v-if="appConfig.footer.beian" :target="appConfig.footer.beian.target" :href="appConfig.footer.beian.href">{{appConfig.footer.beian.name}}</a>
                    </span>
                </div>
            </div>
        </footer>
    </div>
</template>
<style>
.foot_nav {
    padding: 16px 0;
    color: #ffffff;
    background-color: var(--vt-c-black-mute);
}
</style>
<script lang="ts" setup>
// import { ref } from 'vue'
import { useAppConfigStore } from '@/stores/app'
const { appConfig } = useAppConfigStore()
</script>