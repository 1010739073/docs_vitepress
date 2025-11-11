import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
// export default defineConfig({
const vitePressOptions = {
    base: "/",
    title: "Mr-Ning的文档站",
    description: "Mr-Ning的文档站、Mr-Ning记录下一些笔记、Mr-Ning后端开发",
    // logo: '../public/logo.png',
    lastUpdated: true,
    // 插件
    plugins: [
    ],
    // 屏蔽错误提示
    // @ts-ignore
    head: [
        ['link',{ rel: 'icon', href: '/logo.png'}] as any,
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        // 导航栏
        nav: [
            { text: '首页', link: '/' },
            {
                text: '后端',
                activeMatch: '/backend/*',
                items: [
                    { text: 'PHP', link: '/backend/PHP' },
                    { text: 'Python', link: '/backend/Python' },
                    { text: 'MySQL', link: '/backend/MySQL' },
                    { text: 'Redis', link: '/backend/Redis' },
                ]
            },
            {
                text: '教程',
                items: [
                    { text: 'vitepress文档', link: 'https://vitepress.dev/zh/guide/' },
                    { text: 'vitepress教程', link: 'https://vitepress.yiov.top/' },
                    
                ]
            },
            {
                text: '外站工具',
                items: [
                    { text: 'sojson', link: 'https://www.sojson.com' },
                    { text: '时间戳', link: 'https://tool.lu/timestamp/' },
                    
                ]
            },
        ],
        // 社交链接
        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ],
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: "搜索",
                        buttonAriaLabel: "搜索文档",
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "清除查询结果",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                            closeText: "退出",
                        },
                    },
                },
            },
        },
        lastUpdatedText: '上次更新',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '选择语言',
        // 文档页脚文本配置
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        outline: {
            label: '页面导航',
            level: 'deep',
        }
        // editLink: {
        //     pattern: '路径地址',
        //     text: '对本页提出修改建议',
        // },
        // 多语言搜索配置

    }
// })
};
// https://vitepress-sidebar.cdget.com/zhHans/guide/options
// 侧边栏
const vitePressSidebarOptions = [
    {
        // VitePress Sidebar's options here...
        documentRootPath: 'docs',
        scanStartPath: '/',
        collapsed: false,
        capitalizeFirst: true,
        debugPrint: true,
        collapseDepth: 3,
        // sortMenusByName: true,
        // useTitleFromFileHeading: true,
        // useFolderTitleFromIndexFile: true,
    },
    {
        documentRootPath: 'docs',
        scanStartPath: 'backend',
        resolvePath: '/backend/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.',
        sortMenusByName: true,
        useTitleFromFileHeading: true,
        useFolderTitleFromIndexFile: true,
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'PHP',
        resolvePath: '/backend/PHP/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'Python',
        resolvePath: '/backend/Python/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
        
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'Redis',
        resolvePath: '/backend/Redis/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
        
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'MySQL',
        resolvePath: '/backend/MySQL/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs',
        scanStartPath: 'nas',
        resolvePath: '/nas/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
];

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));
