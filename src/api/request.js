import axios from 'axios'
import { baseUrl } from './baseUrl'
const service = axios.create({
    baseURL: baseUrl, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 20000 // request timeout
})
service.defaults.headers.post['Content-Type'] = 'application/json'
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
service.defaults.headers.put['Content-Type'] = 'application/json'
// request interceptor
service.interceptors.request.use(
    config => {
        config.url = config.headers.url
        if (config.headers.url) {
            delete config.headers.url
        }
        if ((config.method === 'post' || config.method === 'put') && config.headers['Content-Type'] === 'application/json') {
            // post、put 提交时，将对象转换为string, 为处理Java后台解析问题
            config.data = JSON.stringify(config.data)
        }
        if (config.method === 'get') {
            // 遍历get请求参数中含有数组参数转化成字符串传参
            for (var key in config.data) {
                if (config.data[key] instanceof Array) {
                    config.data[key] = config.data[key].toString()
                }
            }
            config.params = config.data || {}
        }
        // const token = store.state.user.token
        // token && (config.headers.Authorization = 'Bearer ' + token)
        return config
    },
    error => {
        // do something with request error
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        // 每次请求获取最新token
        if (response.headers.authorization && response.headers.refresh) {
            // let { authorization, refresh } = response.headers
            // store.dispatch('user/setToken', { authorization, refresh })
        }
        if (response.status !== 200) {
            return Promise.reject(response.data)
        }
        // eslint-disable-next-line no-irregular-whitespace
        if (response.data instanceof Blob) {
            return response.data
        }
        if (response.status === 200) {
            return response.data
        }
        return response.data
    },
    error => {
        let msg = error.message
        if (msg) {
            // Message({ message: error.message, type: 'error', duration: 2500, dangerouslyUseHTMLString: false })
        }
        let data = {
            success: false,
            code: 500,
            message: error.message
        }
        return data
    }
)

export default service