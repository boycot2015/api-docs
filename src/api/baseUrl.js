/* eslint-disable no-undef */
// 根据不同的环境设定不同的baseUrl，

let baseUrl = '' // 本地代理y
let loginUrl = '' // 本地代理y
let baseServeUrl

let env = process.env.NODE_ENV === 'development'
    ? 'development' : process.env.VUE_APP_TITLE === 'dev'
        ? 'dev' : process.env.VUE_APP_TITLE === 'show'
            ? 'show' : process.env.VUE_APP_TITLE === 'test'
                ? 'test' : process.env.VUE_APP_TITLE === 'test2'
                    ? 'test2' : process.env.VUE_APP_TITLE === 'app.test'
                        ? 'app.test' : 'production'
switch (env) {
case 'development':
    prefix = `https://gatewaytest.haoxiny.com` // dev环境url
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/portal/web'
    loginUrl = prefix + '/portal/auth'
    break
case 'dev':
    prefix = 'https://gatewaytest.haoxiny.com'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/portal/web'
    loginUrl = prefix + '/portal/auth'
    break
case 'test':
    prefix = 'https://gatewaytest.haoxiny.com'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/portal/web'
    loginUrl = prefix + '/portal/auth'
    break
case 'show':
    prefix = 'https://gatewayshow.haoxiny.com'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/portal/web'
    loginUrl = prefix + '/portal/auth'
    break
case 'production':
    prefix = ' https://gateway.haoxiny.com' // aliyun生产环境url
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/portal/web'
    loginUrl = prefix + '/portal/auth'
    break
}
export {
    baseServeUrl,
    loginUrl,
    baseUrl,
}
export default baseUrl
