export default {
    '/openApi': {
    target: 'http://121.41.51.167:10001',
    changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/openApi/, '') // 不可以省略rewrite
    },
    '/mallApi': {
        target: 'http://192.168.1.225:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallApi/, '') // 不可以省略rewrite
    },
    '/mallAdminApi': {
        target: 'http://192.168.1.225:5201',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallAdminApi/, '') // 不可以省略rewrite
    },
    '/devApi': {
        target: 'http://192.168.4.42:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/devApi/, '') // 不可以省略rewrite
    },
    // http://192.168.4.42:5101
}