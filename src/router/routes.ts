import { RouterView } from 'vue-router'
export default [
    {
      path: '/',
    //   redirect: '/',
      name: 'home',
      meta: {
        title: '首页',
        icon: 'House'
      },
      component: () => import('@/views/home.vue')
    },
    {
        path: '/guide',
        name: 'guide',
        meta: {
            title: '开发指南',
            icon: 'Guide'
        },
        component: () => RouterView,
        children: [
            {
                path: '/guide/getkey',
                name: 'guideGetkey',
                meta: {
                    title: '账号和获取密钥',
                    icon: 'Menu'
                },
                component: () => import('@/views/guide/getkey.vue')
            },
            {
                path: '/guide/usage',
                name: 'guideUsage',
                meta: {
                    title: '使用须知',
                    icon: 'Menu'
                },
                component: () => import('@/views/guide/usage.vue')
            }
        ]
    },
    {
      path: '/log',
      name: 'log',
      meta: {
        title: '更新日志',
        hideHeader: true,
        // hideAnchor: true,
        icon: 'Promotion'
      },
      component: () => import('@/views/log.vue')
    }
  ]