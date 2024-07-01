
// 禁止输入特殊字符
export default {
    beforeUpdate: (el: any, binding: any) => {
        const input = el.getElementsByTagName('input')[0]
        const reg = binding.value || /[^a-zA-Z0-9\u4E00-\u9FA5]/g
        el.addEventListener('input', () => {
            input.value = input.value.replace(reg, '')
        })
    }
}
