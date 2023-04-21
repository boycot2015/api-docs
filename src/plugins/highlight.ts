import type { App } from 'vue-demi';
import hljs from 'highlight.js' //导入代码高亮文
import 'highlight.js/styles/default.css' // 代码高亮的样式
import 'highlight.js/styles/github.css'
// import 'highlight.js/styles/arduino-light.css'
// import 'highlight.js/styles/monokai-light.css'

export default {
    install: (app: App) => {
        //自定义一个代码高亮指令
        app.directive('highlight', function (el) {
            const blocks = el.querySelectorAll('pre code');
            blocks.forEach((block: any) => {
                hljs.highlightElement(block)
            })
        })
    }
}