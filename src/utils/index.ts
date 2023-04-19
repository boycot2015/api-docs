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
      2
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