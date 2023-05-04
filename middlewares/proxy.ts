import http from 'http'
// import type { RequestOptions } from 'http'
const request = (url: any, data: any, fn: ((arg0: string) => any) | undefined) => {
    data = data || {}
    let content = require('querystring').stringify(data.params || {})
    if (data.method === 'post') {
        content = JSON.stringify(data.data)
    }
    let parse_u = require('url').parse(url, true)
    let isHttp = parse_u.protocol == 'http:'
    let options = {
        host: parse_u.hostname,
        port: parse_u.port || (isHttp? 80 : 443),
        path: parse_u.path,
        method: data.method,
        headers:{
            ...data.headers,
            'Content-Type': 'application/json',
            'Content-Length': data.method === 'get' ? content.length : Buffer.byteLength(content)
        }
    }
    // console.log(options, content, 'options');
    let req = require(isHttp ? 'http' : 'https').request(options, function (res:any) {
    let _data= ''
    res.on( 'data' , function (chunk:any){
        _data += chunk;
    })
    res.on( 'end' , function () {
        fn != undefined && fn(_data)
        })
    });
    req.write(content)
    req.end()
}
export const proxyPlugin = () => ({
    name: 'configure-server',
    configureServer(server:any) {
        // 1. 处理特殊请求处理跨域
        // 返回一个钩子，会在其他中间件安装完成后调用
        //   return () => {
        //     server.middlewares.use((req:any, res:any, next:any) => {
        //         // 自定义处理请求 ...
        //         let url = ''
        //         if (req.url.includes('?') && req.url.includes('http')) {
        //             url = req.url.split('?')[1].split('=')[1]
        //         }
        //         console.log(url, 'req, res, next')
        //         if (!url) {
        //             next()
        //             return
        //         }
        //         http.get(url, (result) => {
        //             let list:any = [];
        //             result.on('data', chunk => {
        //                 list.push(chunk);
        //             })
        //             result.on('end', () => {
        //                 const data = JSON.parse(Buffer.concat(list).toString());
        //                 res.send(data)
        //                 next()
        //             })
        //         })
        //     })
        //   }

        // 2. ws通讯处理跨域
        return () => {
            server.ws.on('connection', () => {
                server.ws.send('getRoutes', {})
                server.ws.send('getDataByApiUrl', {})
            })
            // 获取api json数据
            server.ws.on('getRoutes', (data: { url: any }, client: { send: (arg0: string, arg1: {}) => void }) => {
                if (!data.url.includes('http')) {
                    client.send('getRoutes', {})
                    return
                }
                http.get(data.url, (res) => {
                    let list:any = [];
                    res.on('data', chunk => {
                        list.push(chunk);
                    })
                    res.on('end', () => {
                        const data = JSON.parse(Buffer.concat(list).toString());
                        client.send('getRoutes', data)
                    })
                })
            })
            //  获取api数据
            server.ws.on('getDataByApiUrl', (data: { url: any, method: any,  headers: any }, client: { send: (arg0: string, arg1: {}) => void }) => {
                if (!data.url.includes('http')) {
                    client.send('getDataByApiUrl', {})
                    return
                }
                request(data.url, data, (res) => {
                    client.send('getDataByApiUrl', JSON.parse(res))
                })
            })
        }
    }
})