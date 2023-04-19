/**
 * Storage二次封装 命名空间
 */
import config from '@/config'
import { JSONStringify, JSONParse } from '@/utils'
 export default { //可以用this
    getStroage() { //获取所有值并转成json
        //获取本地存储 & 装成json格式 当它是空时，给他一个对象，方便设置没有外层包裹并且直接转成字符串
        return JSONParse(window.localStorage.getItem(config.websitePrefix) || "{}")
    },
    setItem(key:string, val:any, expired?:number) { //设置一个值
        //每次从获取的都是字符串转成json格式的值，添加属性之后，设置成字符串，设置到本地存储
        let storage = this.getStroage()
        storage[key] = {
            data: val,
            time: Date.now(),
            expired
        }
        window.localStorage.setItem(config.websitePrefix, JSONStringify(storage));
    },
    getItem(key:string) { //获取一个值
        //获取到运行函数之后值的key
        let val = this.getStroage()[key]
        if (!val) return val
        if (Date.now() - val.time > val.expired) {
            this.removeItem(key)
            return
        }
        return val.data
    },
    removeItem(key:string) { //删除一个值
        let storage = this.getStroage()
        delete storage[key] //删除属性
        window.localStorage.setItem(config.websitePrefix, JSONStringify(storage))
    },
    clearAll() { //删除所有值
        window.localStorage.clear()
    }
 }
  