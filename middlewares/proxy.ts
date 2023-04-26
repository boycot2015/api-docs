export const proxyPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server:any) {
      // 返回一个钩子，会在其他中间件安装完成后调用
      return () => {
        server.middlewares.use((req:any, res:any, next:any) => {
            console.log(req, res, next, 'req, res, next');
            
          // 自定义处理请求 ...
        })
      }
    }
})