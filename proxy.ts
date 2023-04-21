export default {
    '/openApi': {
    target: 'http://121.41.51.167:10001',
    changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/openApi/, '')
    },
    '/mallApi': {
        target: 'http://192.168.1.225:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallApi/, '')
    },
    '/mallAdminApi': {
        target: 'http://192.168.1.225:5201',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallAdminApi/, '')
    },
    '/devApi': {
        target: 'http://192.168.4.42:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/devApi/, '')
    },
}