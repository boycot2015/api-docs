import effect from '@/plugins/specialEffects'
interface effectProps {
    name: string
    cb: (params?:any) => void
}
interface AppConfigProps {
    websitePrefix: string,
    websiteName?: string
    showBreadcrumb?: boolean
    logoPosition?: string
    primaryColor?:string
    currentEffect?:number
    effect?: effectProps[]
}
export type {
    effectProps,
    AppConfigProps
}
export default <AppConfigProps>({
    websitePrefix: 'yzh_openapi',
    websiteName: '云中鹤开放平台', // 网站名称
    showBreadcrumb: true, // 是否显示面包屑导航 false/true
    logoPosition: 'top', // logo位置 bottom/top
    effect
})