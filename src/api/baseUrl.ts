// 根据不同的环境设定不同的baseUrl，
let prefix = ''
let baseUrl = ''
let loginUrl = ''
let ws = 'http://127.0.0.1:3008'
let env = process.env.NODE_ENV === 'development'
    ? 'development' : process.env.NODE_ENV === 'dev'
        ? 'dev' : process.env.NODE_ENV === 'show'
            ? 'show' : process.env.NODE_ENV === 'test'
                ? 'test' : 'production'
switch (env) {
case 'development':
    prefix = `http://121.41.51.167:10001` // dev环境url
    // prefix = `http://api.boycot.top/swagger.json` // dev环境url
    // prefix = '/openApi'
    // prefix = '/mallAdminDev'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    ws = 'http://127.0.0.1:3008'
    break
case 'dev':
    prefix = 'http://121.41.51.167:10001'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    ws = 'http://127.0.0.1:3008'
    break
case 'test':
    prefix = 'http://121.41.51.167:10001'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    ws = 'http://127.0.0.1'
    break
case 'show':
    prefix = 'http://121.41.51.167:10001'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    ws = 'http://127.0.0.1'
    break
case 'production':
    prefix = 'http://121.41.51.167:10001'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    ws = 'http://127.0.0.1'
    break
}
export {
    loginUrl,
    baseUrl,
    ws
}
export default baseUrl
