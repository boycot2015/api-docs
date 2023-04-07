/* eslint-disable no-undef */
// 根据不同的环境设定不同的baseUrl，
let prefix = ''
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
    // prefix = `http://121.41.51.167:10001` // dev环境url
    prefix = '/openApi'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/v2/api-docs'
    loginUrl = prefix + '/api/login/authskip'
    break
case 'dev':
    prefix = 'https://gateway-show.yunzhonghe.com'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/api'
    loginUrl = prefix + '/api/login/authskip'
    break
case 'test':
    prefix = 'http://gateway.test.limofang.cn'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/api'
    loginUrl = prefix + '/api/login/authskip'
    break
case 'show':
    prefix = 'https://gateway-show.yunzhonghe.com'
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/api'
    loginUrl = prefix + '/api/login/authskip'
    break
case 'production':
    prefix = 'https://gateway.yunzhonghe.com' // aliyun生产环境url
    baseServeUrl = prefix + '/api/file'
    baseUrl = prefix + '/api'
    loginUrl = prefix + '/api/login/authskip'
    break
}
export {
    baseServeUrl,
    loginUrl,
    baseUrl,
}
export default baseUrl
