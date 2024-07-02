import type { App } from 'vue';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/default.css' // 代码高亮的样式
// import 'highlight.js/styles/github.css'
// import 'highlight.js/styles/idea.css'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript)
export default {
    install: (app: App) => {
        //自定义一个代码高亮指令
        app.directive('highlight', function (el: any) {
            const blocks = el.querySelectorAll('pre code');
            blocks.forEach((block: any) => {
                hljs.highlightElement(block)
            })
        })
    }
}