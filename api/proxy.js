// 该服务为 vercel serve跨域处理
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
    // let target = ''
    // 代理目标地址
    // 这里使用 blog-api 主要用于区分 vercel serverless 的 api 路径
    // target 替换为你跨域请求的服务器 如： http://baidu.com
    // console.log(req.url, req.params, 'params');
    // if (req.url.startsWith('/blog-api')) {
    //     target = 'https://blog-api.boycot.top'
    //     // 创建代理对象并转发请求
    //     createProxyMiddleware({
    //         target,
    //         changeOrigin: true,
    //         pathRewrite: {
    //             // 通过路径重写，去除请求路径中的 `/blog-api`
    //             // 例如 /backend/user/login 将被转发到 https://fanyi-api.baidu.com/user/login
    //             '^/blog-api': '/',
    //         },
    //     })(req, res)
    // }
    // createProxyMiddleware({
    //     target: req.params.url,
    //     changeOrigin: true,
    //     pathRewrite: (path, req) => req.params[0],
    // })(req, res)
}