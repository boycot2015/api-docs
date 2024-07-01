
// 防重复点击
export default {
    beforeUpdate: (el: any, binding: any) => {
        let timer: string | number | NodeJS.Timeout | undefined
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    el.disabled = false
                }, binding.value || 1000)
            }
        })
    }
}
