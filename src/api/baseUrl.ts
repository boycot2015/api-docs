/* eslint-disable no-undef */
// 根据不同的环境设定不同的baseUrl，
let prefix = ''
let baseUrl = '' // 本地代理y
let loginUrl = '' // 本地代理y
let baseServeUrl = '' // 本地代理y

let env = process.env.NODE_ENV === 'development'
    ? 'development' : process.env.NODE_ENV === 'dev'
        ? 'dev' : process.env.NODE_ENV === 'show'
            ? 'show' : process.env.NODE_ENV === 'test'
                ? 'test' : 'production'
switch (env) {
case 'development':
    // prefix = `http://121.41.51.167:10001` // dev环境url
    // prefix = `http://192.168.1.225:5101` // dev环境url
    prefix = '/openApi'
    prefix = '/dev'
    baseServeUrl = `` // dev环境url
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    break
case 'dev':
    prefix = 'https://gateway-show.yunzhonghe.com'
    baseServeUrl = `` // dev环境url
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    break
case 'test':
    prefix = 'http://gateway.test.limofang.cn'
    baseServeUrl = `` // dev环境url
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    break
case 'show':
    prefix = 'https://gateway-show.yunzhonghe.com'
    baseServeUrl = `` // dev环境url
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    break
case 'production':
    // prefix = 'https://gateway.yunzhonghe.com' // aliyun生产环境url
    prefix = 'http://192.168.4.42:5101'
    baseServeUrl = `` // dev环境url
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    break
}
export {
    baseServeUrl,
    loginUrl,
    baseUrl,
}
export default baseUrl
