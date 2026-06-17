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
                text: '技术文档',
                items: [
                    {
                        text: '后端开发',
                        items: [
                            { text: 'PHP', link: '/backend/PHP' },
                            { text: 'Python', link: '/backend/Python' },
                            { text: 'Go', link: '/backend/Go' },
                            { text: 'Linux', link: '/backend/Linux' },
                            { text: 'Nginx', link: '/backend/Nginx' },
                            { text: '分布式', link: '/backend/Distributed' },
                        ],
                    },
                    {
                        text: '数据库',
                        items: [
                            { text: 'MySQL', link: '/database/MySQL' },
                            { text: 'PostgreSQL', link: '/database/PostgreSQL' },
                            { text: 'SQL Server', link: '/database/SQLServer' },
                            { text: 'Redis', link: '/database/Redis' },
                            { text: 'Elasticsearch', link: '/database/Elasticsearch' },
                        ],
                    },
                    {
                        text: '消息队列',
                        items: [
                            { text: 'Kafka', link: '/mq/Kafka' },
                            { text: 'RabbitMQ', link: '/mq/RabbitMQ' },
                        ],
                    },
                    {
                        text: '大数据',
                        items: [
                            { text: 'Hadoop', link: '/bigdata/Hadoop' },
                        ],
                    },
                ]
            },
            {
                text: 'Vibe Coding',
                activeMatch: '/vibe-coding/*',
                items: [
                    { text: 'Claude Code', link: '/vibe-coding/Claude_Code使用教程' },
                    { text: 'Codex CLI', link: '/vibe-coding/Codex_CLI使用教程' },
                ]
            },
            {
                text: '工具箱',
                items: [
                    {
                        text: '站内工具',
                        items: [
                            { text: '工具合集', link: '/tools' },
                        ],
                    },
                    {
                        text: '外站工具',
                        items: [
                            { text: 'sojson', link: 'https://www.sojson.com' },
                            { text: '时间戳', link: 'https://tool.lu/timestamp/' },
                            { text: 'urlencode', link: 'https://tool.chinaz.com/tools/urlencode.aspx' },
                            { text: 'unicode', link: 'https://tool.chinaz.com/tools/unicode.aspx' },
                        ],
                    },
                    {
                        text: '图床',
                        items: [
                            { text: '大厂图床', link: 'https://file.sang.pub/' },
                            { text: '任你流', link: 'https://file.leishennb.icu/' },
                            { text: '柯艺图床', link: 'https://tc.qdqqd.com/' },
                            { text: '抖音解析', link: 'https://695402.xyz/dy' },
                            { text: '喷子图床', link: 'https://pz.al/' },
                            { text: '乱搞文件床', link: 'https://www.luangao.de/' },
                        ],
                    },
                ]
            },
            {
                text: '教程',
                items: [
                    { text: 'VitePress 文档', link: 'https://vitepress.dev/zh/guide/' },
                    { text: 'VitePress 教程', link: 'https://vitepress.yiov.top/' },
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
        sidebarMenuLabel: '菜单',
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
        scanStartPath: 'Go',
        resolvePath: '/backend/Go/',
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
        documentRootPath: 'docs/database',
        scanStartPath: 'Redis',
        resolvePath: '/database/Redis/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
        
    },
    {
        documentRootPath: 'docs/database',
        scanStartPath: 'MySQL',
        resolvePath: '/database/MySQL/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/database',
        scanStartPath: 'SQLServer',
        resolvePath: '/database/SQLServer/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/database',
        scanStartPath: 'PostgreSQL',
        resolvePath: '/database/PostgreSQL/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'Linux',
        resolvePath: '/backend/Linux/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'Nginx',
        resolvePath: '/backend/Nginx/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/backend',
        scanStartPath: 'Distributed',
        resolvePath: '/backend/Distributed/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/database',
        scanStartPath: 'Elasticsearch',
        resolvePath: '/database/Elasticsearch/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs',
        scanStartPath: 'mq',
        resolvePath: '/mq/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.',
        sortMenusByName: true,
        useTitleFromFileHeading: true,
        useFolderTitleFromIndexFile: true,
    },
    {
        documentRootPath: 'docs/mq',
        scanStartPath: 'Kafka',
        resolvePath: '/mq/Kafka/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/mq',
        scanStartPath: 'RabbitMQ',
        resolvePath: '/mq/RabbitMQ/',
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
    {
        documentRootPath: 'docs',
        scanStartPath: 'bigdata',
        resolvePath: '/bigdata/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs/bigdata',
        scanStartPath: 'Hadoop',
        resolvePath: '/bigdata/Hadoop/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs',
        scanStartPath: 'tools',
        resolvePath: '/tools/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
    {
        documentRootPath: 'docs',
        scanStartPath: 'vibe-coding',
        resolvePath: '/vibe-coding/',
        useTitleFromFrontmatter: true,
        sortMenusOrderNumericallyFromLink: true,
        removePrefixAfterOrdering: true,
        prefixSeparator: '.'
    },
];

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));
