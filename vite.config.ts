import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import ElementPlus from 'unplugin-element-plus/vite'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
        resolvers: [
            ElementPlusResolver({
            importStyle: "sass",
            // directives: true,
            // version: "2.1.5",
            }),
            // ElementPlus({
            //     useSource: true,
            // }),
        ],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "src/assets/main.scss";`,
            }
        }
    },
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '_coms': fileURLToPath(new URL('./src/components', import.meta.url)),
        }
    }
})
