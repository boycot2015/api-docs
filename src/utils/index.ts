/** 三级单元格合并
 * @param { array } 表数据
 * @param { object } { key: 合并字段, rKey: 合并关联字段(父级), span: 合并的列数 }
 * @returns { object } { one , two, tree } 合并列行的数量
 */
 export const getRowSpan = (data:any, spanParams:any = {}) => {
    let spanOneArr:any = []
    let spanTwoArr:any = []
    let spanThreeArr:any = []
    let concatOne = 0
    let concatTwo = 0
    let concatThree = 0
    data.forEach((item:any, index:any) => {
        if (index === 0) {
            spanOneArr.push(1)
            spanTwoArr.push(1)
            spanThreeArr.push(1)
        } else {
            if (item[spanParams['key']] === data[index - 1][spanParams['key']]) {
                spanOneArr[concatOne] += 1
                spanOneArr.push(0)
            } else {
                spanOneArr.push(1)
                concatOne = index
            }
            if (spanParams['span'] === 2) {
                if (item[spanParams['key']] === data[index - 1][spanParams['key']] &&
                    item[spanParams['rKey']] === data[index - 1][spanParams['rKey']]) {
                    spanTwoArr[concatTwo] += 1
                    spanTwoArr.push(0)
                } else {
                    spanTwoArr.push(1)
                    concatTwo = index
                }
            }
            if (spanParams['span'] === 3) {
                if (item[spanParams['key']] === data[index - 1][spanParams['key']] &&
                    item[spanParams['rKey']] === data[index - 1][spanParams['rKey']]) {
                    spanThreeArr[concatThree] += 1
                    spanThreeArr.push(0)
                } else {
                    spanThreeArr.push(1)
                    concatThree = index
                }
            }
        }
    })
    return {
        one: spanOneArr,
        two: spanTwoArr,
        three: spanThreeArr
    }
}

// 对象序列化，undefined和函数丢失问题
export const JSONStringify = (option:any) => {
    return JSON.stringify(option,
      (key, val) => {
        // 处理函数丢失问题
        if (typeof val === 'function') {
          return `${val}`;
        }
        // 处理undefined丢失问题
        if (typeof val === 'undefined') {
          return 'undefined';
        }
        return val;
      },
      4
    )
}
// 对象序列化解析
export const JSONParse = (objStr:any) => {
    return JSON.parse(objStr, (k, v) => {
        try {
            if (typeof v === 'string' && v.indexOf && v.indexOf('function') > -1) {
              // eval 可能在eslint中报错，需要加入下行注释
              // eslint-disable-next-line
              return eval(`(function(){return ${v}})()`);
            }
            if (v === 'undefined') return undefined
            return v
        } catch (error) {
            return v
        }
    })
}
/**
 * 复制内容到剪切板
 * @param textToCopy 要复制的值
 * @returns 
 */
export const copyToClipboard = (textToCopy:string) => {
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // 创建text area
        let textArea:any = document.createElement("textarea");
        textArea.value = textToCopy;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((resolve, reject) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? resolve({}) : reject();
            textArea.remove();
        });
    }
}
export const getDynamicIcon = (name:string) => {
    if (!name) return 'ep:menu'
    let icons = [{ name: 'goods',icon: 'ep:goods'},
    { name: 'address', icon: 'mdi:address-marker-outline' },
    { name: 'finance', icon: 'icon-park-outline:finance' },
    { name: 'order', icon: 'icon-park-outline:transaction-order' },
    { name: 'stock', icon: 'mdi:warehouse' },
    { name: 'activity', icon: 'material-symbols:auto-activity-zone-outline' },
    { name: 'supplier', icon: 'iconoir:house-rooms' },
    { name: 'warehouse', icon: 'mdi:warehouse' },
    { name: 'user', icon: 'ph:user' },
    { name: 'redpacket', icon: 'mingcute:red-packet-line' },
    { name: 'points', icon: 'ic:outline-control-point' },
    { name: 'customer', icon: 'raphael:customer' },
    // raphael:customer
    { name: 'group', icon: 'uit:object-ungroup' },
    { name: 'message', icon: 'ri:message-3-line' },
    { name: 'virtual', icon: 'mdi:virtual-reality' },
    { name: 'website', icon: 'ic:outline-store' }]
    let icon = ''
    icons.some(el => {
        if (name.includes(el.name.toLowerCase())) icon = el.icon
    })
    return icon
}
export const getValidRoute = (routes:any) => {
    let arr:any = []
    routes?.map((el:any) => {
        if (el.children && el.children.length) {
            arr = [...arr, ...getValidRoute(el.children)]
        } else {
            arr.push({ ...el, value: el.meta?.pageData?.url || el.path, name: el.meta?.title || el.name, meta: { ...el.meta, icon: getDynamicIcon(el.path) } })
        }
    })
    return arr
}

/**
 * 
 * @param data 下载的数据
 * @param fileName 文件名
 * @param fileType 文件类型
 */
export const downloadFile = (data:any, fileName = 'file', fileType = 'json') => {
    let uri = 'data:text/csv;charset=utf-8,\ufeff'
    try {
        //encodeURIComponent解决中文乱码
        uri += encodeURIComponent(JSON.stringify(data || {}))
    } catch (error) {
        uri += data + ''
    }
    //通过创建a标签实现
    let link = document.createElement('a')
    link.href = uri;
    //对下载的文件命名
    link.download = fileName + '-' + new Date().toLocaleString().trim().replace(/:/g, '').replace(/\//g, '').split(' ').join('-') + '.' + fileType
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}