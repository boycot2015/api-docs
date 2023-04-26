import Layout from '@/layout/index.vue'
export default [
    {
        path: '/',
        // redirect: '/home',
        name: 'index',
        meta: {
          title: '首页',
          hideInSearch: true,
          icon: 'House'
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
        path: '/log',
        name: 'log',
        redirect: '/log/index',
        meta: {
            title: '更新日志',
            hideChildren: true,
            icon: 'Promotion'
        },
        component: Layout,
        children: [
            {
                path: '/log/index',
                name: 'logList',
                meta: {
                    title: '更新日志',
                    // hideHeader: true,
                    showAnchor: true,
                    icon: 'Menu'
                },
                component: () => import('@/views/log.vue'),
            }
        ]
    },
    {
        path: '/apps',
        name: 'apps',
        redirect: '/apps/index',
        meta: {
            title: '项目',
            hideChildren: true,
            showInHeader: true,
            icon: 'Menu'
        },
        component: Layout,
        children: [
            {
                path: '/apps/index',
                name: 'appsList',
                meta: {
                    title: '项目列表',
                    showInHeader: true,
                    icon: 'Menu'
                },
                component: () => import('@/views/apps/index.vue'),
            }
        ]
    }
]