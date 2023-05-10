
// 禁止输入特殊字符
export default {
    beforeUpdate: (el: { getElementsByTagName: (arg0: string) => any[]; addEventListener: (arg0: string, arg1: () => void) => void }, binding: any) => {
        const input = el.getElementsByTagName('input')[0]
        const reg = binding.value || /[^a-zA-Z0-9\u4E00-\u9FA5]/g
        el.addEventListener('input', () => {
            input.value = input.value.replace(reg, '')
        })
    }
}
