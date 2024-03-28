import Layout from '@/layout/index.vue'
export default [
    {
        path: '/',
        // redirect: '/home',
        name: 'index',
        meta: {
          title: '首页',
          affix: true,
          hideInSearch: true,
          hideInMenu: true,
          icon: 'ep:house'
        },
        component: () => import('@/views/home.vue')
      },
      {
        path: '/error',
        name: 'error',
        meta: {
            title: '404',
            hideInSearch: true,
            hideInMenu: true,
        },
        component: () => import('@/views/error.vue')
      },
    // {
    //     path: '/guide',
    //     name: 'guide',
    //     meta: {
    //         title: '开发指南',
    //         icon: 'Guide'
    //     },
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/guide/getkey',
    //             name: 'guideGetkey',
    //             meta: {
    //                 title: '账号和获取密钥',
    //                 icon: 'Menu'
    //             },
    //             component: () => import('@/views/guide/getkey.vue')
    //         },
    //         {
    //             path: '/guide/usage',
    //             name: 'guideUsage',
    //             meta: {
    //                 title: '使用须知',
    //                 icon: 'Menu'
    //             },
    //             component: () => import('@/views/guide/usage.vue')
    //         }
    //     ]
    // },
    {
        path: '/apps',
        name: 'apps',
        redirect: '/apps/index',
        meta: {
            title: '项目',
            hideChildren: true,
            showInHeader: true,
            hideInMenu: true,
            affix: true,
            icon: 'ri:app-store-line'
        },
        component: Layout,
        children: [
            {
                path: '/apps/index',
                name: 'appsList',
                meta: {
                    title: '项目列表',
                    showInHeader: true,
                    icon: 'ri:app-store-line'
                },
                component: () => import('@/views/apps/index.vue'),
            }
        ]
    },
    {
        path: '/files',
        name: 'files',
        redirect: '/files/index',
        meta: {
            title: '文件',
            hideChildren: true,
            showInHeader: true,
            hideInMenu: true,
            affix: true,
            icon: 'ri:image-line'
        },
        component: Layout,
        children: [
            {
                path: '/files/index',
                name: 'fileList',
                meta: {
                    title: '文件列表',
                    showInHeader: true,
                    icon: 'ri:app-store-line'
                },
                component: () => import('@/views/files/index.vue'),
            }
        ]
    },
    {
        path: '/log',
        name: 'log',
        redirect: '/log/index',
        meta: {
            affix: true,
            title: '更新日志',
            hideChildren: true,
            showInHeader: false,
            hideInMenu: true,
            icon: 'mdi:math-log'
        },
        component: Layout,
        children: [
            {
                path: '/log/index',
                name: 'logList',
                meta: {
                    title: '更新日志',
                    showInHeader: true,
                    showAnchor: true,
                    icon: 'mdi:math-log'
                },
                component: () => import('@/views/log.vue'),
            }
        ]
    },
]