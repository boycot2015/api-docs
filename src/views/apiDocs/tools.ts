import type { TableColumnCtx } from 'element-plus'
interface ColumnProps {
    in: string
    name: string
    type: string
    required: string
    child?: string
    example?: unknown
    format?:string
    children?: ColumnProps[]|undefined
    description: string
}
interface Column {
    prop: string
    span?: boolean
    label: string
    width?: number
    formatter?: (row:ColumnProps, column?:any, cellValue?:string, index?:number) => any
    minWidth?: string
}
interface FormProps {
    Method?: string
    Authorization?: string
    Timestamp?: string
    'Random-Code'?: string
    code?: number
    message?: string
    bodyRequired?:boolean
    bodyParams?: string
}
interface SpanMethodProps {
    row: ColumnProps
    column: TableColumnCtx<Column>
    rowIndex: number
    columnIndex: number
}
interface ResponseTypes {
    string: string
    number: number
    boolean: boolean
    integer: number
}

const getCustomParams = (data:any) => {
    let defaultParams = [
        {
            description : "token令牌",
            in: "header",
            name: "Authorization",
            required: false,
            type: "string"
        },
        {
            description : "商城域名",
            in: "header",
            name: "website-path",
            required: true,
            type: "string"
        }
    ]
    let hasProps = false
    let isB2C = data?.info?.title?.includes('B2C')
    data.data?.parameters?.map((el:any) => {
        if (defaultParams.map((val:any) => val.name).includes(el.name)) {
            hasProps = true
        }
    })
    if (hasProps && !isB2C) return []
    return hasProps ? (isB2C ? [] : '') : isB2C ? [] : [defaultParams[0]]
}

const getParams = (data:ColumnProps[], child?:boolean, name?:string) => {    
    return data && data.map && data.map((el:ColumnProps|any) => {
        let children =  el.children ?  el.children || '' : el.schema ? el.schema.$ref || '' : ''
        if (children && children.length) {
            children = getParams(children, true, el.type === 'array' ? el.name+'[]' : el.type ? el.name : 'body')
        }
        return { ...el, in: el.in || (el.type === 'array' ? 'body': el.type === 'object' ? 'object': name), children, child }
    })
}
const arr2obj = (method:string, arr:ColumnProps[] | undefined, prop = 'children') => {
    let obj:any = {}
    let types:ResponseTypes | any = {
        string: '',
        number: 0,
        array: method === 'get' ? '' : [],
        boolean: false,
        integer: ''
    }
    arr && arr.map && arr.map((el:ColumnProps | any) => {
        obj[el.name] = el.example || types[el.type] !== undefined ? types[el.type] : ''
        if (el[prop] && el[prop].length) {
            obj[el.name] = arr2obj(method, el[prop], prop)
            if (el.type === 'array') {
                obj[el.name] = [arr2obj(method, el[prop], prop)]
            }
        }
    })
    return obj
}
export type {
    ColumnProps,
    Column,
    FormProps,
    ResponseTypes,
    SpanMethodProps
}
export {
    getCustomParams,
    getParams,
    arr2obj
}