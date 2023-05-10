import { fileURLToPath, URL } from 'node:url'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { defineConfig } from 'vite'
import { proxyPlugin } from './middlewares'
import proxy from './proxy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import ElementPlus from 'unplugin-element-plus/vite'
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3008,
        proxy
    },
    plugins: [
        vue(),
        vueJsx(),
        proxyPlugin(),
        createStyleImportPlugin({
            resolves: [ElementPlusResolve()],
            libs: [
                {
                  libraryName: 'element-plus',
                  esModule: true,
                  resolveStyle: (name: string) => {
                    name = name.substring(3, name.length);
                    return `element-plus/es/components/${name}/style/index`;
                  },
                }
            ]
        }),
        AutoImport({
            imports: ['vue', 'vue-router'],
            dts: 'src/auto-import.d.ts',
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            dirs: ['src/components/'],
            resolvers: [
                ElementPlusResolver({
                importStyle: "sass",
                // directives: true,
                // version: "2.1.5",
                }),
                IconsResolver({ enabledCollections: ['ep'] })
            ],
            dts: true,
            deep: true
        }),
        Icons({
            compiler: 'vue3',
            scale: 1,
            defaultClass: 'inline-block',
            autoInstall: true
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "src/assets/scss/main.scss";`,
            }
        }
    },
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '_coms': fileURLToPath(new URL('./src/components', import.meta.url)),
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'element-plus': ['element-plus'],
                    // 'axios': ['axios'],
                    // 'pinia': ['pinia'],
                    'highlight': ['highlight.js'],
                    'nprogress': ['nprogress']
                }
            }
        }
    }
})
