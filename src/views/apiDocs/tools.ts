import type { TableColumnCtx } from 'element-plus'
interface ColumnProps {
    in: string
    name: string
    type: string
    required: string
    child?: string
    example?: unknown
    children?: ColumnProps[]|undefined
    description: string
}
interface Column {
    prop: string
    span?: boolean
    label: string
    width?: number
    formatter?: CallableFunction
    minWidth?: string
}
interface FormProps {
    Method?: string
    Authorization?: string
    Timestamp?: string
    'Random-Code'?: string
    code?: number
    message?: string
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
const getParams = (data:any, child?:boolean, name?:string) => {
    return data.map((el:any = {}) => {
        let children =  el.children ?  el.children || '' : el.schema ? el.schema.$ref || '' : ''
        if (children && children.length) {
            children = getParams(children, true, el.type === 'array' ? 'items': el.type ? el.name : 'body')
        }
        return { ...el, in: el.in || (el.type === 'array' ? 'items': el.type === 'object' ? 'object': name), children, child }
    })
}
const arr2obj = (arr:ColumnProps[] | undefined, prop = 'children') => {
    let obj:any = {}
    let types:ResponseTypes | any = {
        string: '',
        number: 0,
        boolean: false,
        integer: 1
    }
    arr?.map((el:any) => {
        obj[el.name] = el.example || types[el.type]
        if (el[prop] && el[prop].length) {
            obj[el.name] = arr2obj(el[prop], prop)
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
    getParams,
    arr2obj
}