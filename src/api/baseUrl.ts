// 根据不同的环境设定不同的baseUrl，
let prefix = ''
let baseUrl = ''
let loginUrl = ''
let ws = 'http://127.0.0.1:3008'
let apiUrl = ''
let env = process.env.NODE_ENV === 'development'
    ? 'development' : process.env.NODE_ENV === 'dev'
        ? 'dev' : process.env.NODE_ENV === 'show'
            ? 'show' : process.env.NODE_ENV === 'test'
                ? 'test' : 'production'
switch (env) {
case 'development':
    prefix = `http://api.boycot.top/swagger.json`
    // prefix = `http://api.boycot.top` // dev环境url
    // prefix = '/openApi'
    // prefix = '/mallAdminDev'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    apiUrl = 'http://api.boycot.top/api'
    // apiUrl = 'http://127.0.0.1:8090/api'
    ws = 'http://127.0.0.1:3008'
    break
case 'dev':
    prefix = 'http://api.boycot.top'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    apiUrl = '/boycot-api'
    ws = 'http://127.0.0.1:3008'
    break
case 'test':
    prefix = 'http://api.boycot.top'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    apiUrl = '/boycot-api'
    ws = 'http://127.0.0.1'
    break
case 'show':
    prefix = 'http://api.boycot.top'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    apiUrl = '/boycot-api'
    ws = 'http://127.0.0.1'
    break
case 'production':
    prefix = 'http://api.boycot.top'
    baseUrl = prefix
    loginUrl = prefix + '/api/login/authskip'
    apiUrl = '/boycot-api'
    ws = 'http://127.0.0.1'
    break
}
export {
    loginUrl,
    baseUrl,
    apiUrl,
    ws
}
export default baseUrl
