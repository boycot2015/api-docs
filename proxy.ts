export default {
    '/openApi': {
        readonly: true,
        name: '开发平台文档',
        target: 'http://121.41.51.167:10001',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/openApi/, '')
    },
    // '/v2/api-docs': {
    //     readonly: true,
    //     name: '开发平台文档',
    //     target: 'http://127.0.0.1:3008',
    //     changeOrigin: true,
    //     rewrite: (path:string) => path.replace(/^\/v2\/api-docs/, ''),
    //     router: (req:any) => {
    //         console.log(req, '123123123');
    //         let url = req.host
    //         if (req.url.includes('?') && req.url.includes('http')) {
    //             url = req.url.split('?')[1].split('=')[1]
    //         }
    //         return url
    //     }
    // },
    '/mallTest': {
        readonly: true,
        name: '商城前端测试环境开发文档',
        target: 'http://192.168.1.225:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallTest/, '')
    },
    '/mallAdminTest': {
        readonly: true,
        name: '商城后台测试环境开发文档',
        target: 'http://192.168.1.225:5201',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallAdminTest/, '')
    },
    '/mallDev': {
        readonly: true,
        name: '商城前端开发环境开发文档',
        target: 'http://192.168.4.42:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallDev/, '')
    },
    '/mallAdminDev': {
        readonly: true,
        name: '商城后台开发环境开发文档',
        target: 'http://192.168.4.42:5201',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/mallAdminDev/, '')
    },
    '/dev': {
        readonly: true,
        name: '开发环境开发文档',
        target: 'http://192.168.1.225:5101',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/dev/, ''),
        router: (req:any) => {
            let url = req.host
            if (req.url.includes('?') && req.url.includes('http')) {
                url = req.url.split('?')[1].split('=')[1]
            }
            return url
        }
        // configure: (proxy:any, options:any) => {
        //     // proxy 是 'http-proxy' 的实例
        //     proxy.on('proxyReq', (proxyReq:any, req:any, res:any) => {
        //         console.log(proxyReq, 'proxy, options');
        //         // axios.get(req.url, {}).then(data => {
        //         //     console.log(data, 'data');
        //         // }).catch((err) => {
        //         //     console.log(err, 'err')
        //         // })
        //         req.host = req.url ? (req.url.split('?') ? req.url.split('?')[1].split('=')[1] : ''): req.host
        //         // res.setHeader("Access-Control-Allow-Origin", "*")
        //         // res.setHeader("content-type","application/json")
        //     })
        // }
    },
    '/gitee': {
        target: 'https://gitee.com/',
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/gitee/, ''),
    }
}