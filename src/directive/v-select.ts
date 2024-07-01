
// 下拉加载
export default {
    beforeUpdate: (el: any, binding: any) => {
        // 获取滚动页面DOM
        let SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SCROLL_DOM.addEventListener('scroll', (e: { target: { scrollHeight: number; scrollTop: number; clientHeight: number } }) => {
            const condition = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight
            if (condition) {
                binding.value(true)
            }
        })
    }
}
