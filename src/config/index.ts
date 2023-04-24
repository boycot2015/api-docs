import effect from '@/plugins/specialEffects'
interface effectProps {
    name: string
    cb: (params?:any) => void
}
interface LinkProps {
    name: string
    href: string
    target: string
}
interface FooterProps {
    copyright: string
    beian: {
        name: string
        href: string
        target: string
    },
    links: LinkProps[]
}
interface AppConfigProps {
    websitePrefix: string,
    websiteName?: string
    showBreadcrumb?: boolean
    logoPosition?: string
    primaryColor?:string
    currentEffect?:number
    effect?: effectProps[]
    baseUrl?:string
    apiUrl?:string
    footer?: FooterProps
}
export type {
    effectProps,
    AppConfigProps
}
export default <AppConfigProps>({
    primaryColor: '#2458b3',
    websitePrefix: 'yzh_openapi',
    websiteName: '云中鹤开放平台', // 网站名称
    showBreadcrumb: true, // 是否显示面包屑导航 false/true
    logoPosition: 'top', // logo位置 bottom/top
    effect,
    currentEffect: -1,
    footer: {
        copyright: '2001-2023 云中鹤版权所有',
        beian: {
            name: '粤ICP备16107141号',
            href: 'https://beian.miit.gov.cn/',
            target: '_blank'
        },
        links: [{
            name: '云中鹤官网',
            href: 'https://www.yunzhonghe.com/',
            target: '_blank'
        }]
    }
})