import effect from '@/plugins/specialEffects'
import { baseUrl } from '@/api/baseUrl'
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
    footer?: FooterProps,
    gitConfig?:{
        owner:string
        repo:string
        access_token:string
    }
}
export type {
    effectProps,
    AppConfigProps
}
// #f8711a #2458b3 #646cff
export default <AppConfigProps>({
    primaryColor: '#646cff',
    websitePrefix: 'openapi',
    websiteName: '开发者平台', // 网站名称
    showBreadcrumb: true, // 是否显示面包屑导航 false/true
    showMenuInHeader: false, // 是否在头部显示菜单
    logoPosition: 'top', // logo位置 bottom/top
    effect,
    apiUrl: baseUrl,
    apiList: [{
        id: 1,
        replace: true,
        icon: 'fluent:developer-board-16-regular',
        name: '开发文档',
        url: baseUrl
    },
    {
        id: 2,
        replace: false,
        icon: 'fluent:developer-board-16-regular',
        name: 'BLOG文档',
        url: 'http://blog-api.boycot.top/swagger.json'
    },
    {
        id: 3,
        replace: false,
        icon: 'fluent:developer-board-16-regular',
        name: 'B2C开发文档',
        url: 'http://192.168.1.225:5101'
    }],
    currentEffect: -1,
    footer: {
        copyright: '2016-2024 boycot版权所有',
        beian: {
            name: '粤ICP备18002072号',
            href: 'https://beian.miit.gov.cn/',
            target: '_blank'
        },
        links: [{
            name: '博客系统',
            href: 'https://www.boycot.top/',
            target: '_blank'
        },{
            name: '博客管理系统',
            href: 'https://blog-admin.boycot.top/',
            target: '_blank'
        },{
            name: '网抑云音乐',
            href: 'https://music.boycot.top/',
            target: '_blank'
        },
        // {
        //     name: '云台系统',
        //     href: 'https://user.yunzhonghe.com/',
        //     target: '_blank'
        // }
        // {
        //     name: '积分中台',
        //     href: 'https://admin-points.haoxiny.com/',
        //     target: '_blank'
        // },
        // {
        //     name: 'GitLab',
        //     href: 'http://192.168.1.218:8888/YZH-WEB',
        //     target: '_blank'
        // },
        // {
        //     name: '云中鹤官网',
        //     href: 'https://www.yunzhonghe.com/',
        //     target: '_blank'
        // }
    ]
    },
    gitConfig: { // git仓库配置
        owner: 'boycot',
        repo: 'api-docs',
        access_token: 'c9a430a278c549ce82abd2e19a2b36ed'
    }
})