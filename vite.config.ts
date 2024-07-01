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
import viteCompression from 'vite-plugin-compression' // 开启gzip
import { webUpdateNotice } from '@plugin-web-update-notification/vite'  // 检测网页更新并通知用户刷新
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const timestamp = new Date().getTime()
const base = '/'
export default defineConfig({
    server: {
        port: 3008,
        // https: true,
        proxy
    },
    base,
    plugins: [
        vue(),
        vueJsx(),
        proxyPlugin(),
        viteCompression({
            threshold: 102400 // 对大于 100kb 的文件进行压缩
        }),
        webUpdateNotice({
            logVersion: true,
            versionType: 'build_timestamp',
            injectFileBase: base,
            checkInterval: 10 * 1000,
            notificationProps: {
                title: '温馨提示',
                description: '检测到最新版本，是否重新加载页面？',
                buttonText: '刷新页面',
                dismissButtonText: '忽略'
            },
            notificationConfig: {
                // primaryColor: 'red',
                // secondaryColor: 'blue',
                placement: 'topRight'
            }
        }),
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
        },
        // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 导入时想要忽略的扩展名列表
    },
    esbuild: {
        // drop: ["console", "debugger"],
    },
    build: {
        modulePreload: { // 是否自动注入 module preload 的 polyfill
            polyfill: true
        },
        outDir: 'dist', // 指定输出路径
        assetsDir: 'assets', // 指定生成静态文件目录
        assetsInlineLimit: 4096, // 小于此阈值的导入或引用资源将内联为 base64 编码
        cssCodeSplit: true, // 启用 CSS 代码拆分
        emptyOutDir: true, // 构建时清空outDir目录
        chunkSizeWarningLimit: 1000, // 规定触发警告的 chunk 大小
        rollupOptions: {
            output: {
                manualChunks: {
                    // 'axios': ['axios'],
                    // 'pinia': ['pinia'],
                    'element-plus': ['element-plus'],
                    'highlight': ['highlight.js'],
                    'nprogress': ['nprogress']
                },
                // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
                entryFileNames: `js/[name].[hash].${timestamp}.js`,
                // 用于命名代码拆分时创建的共享块的输出命名
                chunkFileNames: `js/[name].[hash].${timestamp}.js`,
                // 用于输出静态资源的命名，[ext]表示文件扩展名
                // assetFileNames: `[ext]/[name].[hash].${timestamp}.[ext]`,
                assetFileNames: (assetInfo:any) => {
                    let info = assetInfo.name.split('.')
                    let extType = info[info.length - 1]
                    let fileTypes = ['css', 'media', 'img', 'fonts']
                    if (/\.(css)(\?.*)?$/i.test(assetInfo.name)) {
                        extType = fileTypes[0]
                    } else if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/.test(assetInfo.name)) {
                        extType =  fileTypes[1]
                    } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
                        extType =  fileTypes[2]
                    } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
                        extType = fileTypes[3]
                    }
                    return `${fileTypes.includes(extType) ? extType: 'static'}/[name]-[hash]${timestamp}[extname]`
                }
            }
        }
    },
    preview: {
        port: 3380, // 指定预览服务器端口
        strictPort: true, // 若端口已被占用则会直接退出
        // https: true, // 启用 TLS + HTTP/2
        open: true, // 启动时自动在浏览器中打开应用程序
        proxy,
        cors: true, // 配置 CORS
    }
})
