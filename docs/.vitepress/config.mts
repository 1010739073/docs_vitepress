import { defineConfig } from 'vitepress'
import { jsSidebar } from './js/clientSidbar.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/",
    title: "Mr-Ning的文档站",
    description: "记录下一些笔记",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            {
                text: '外站工具',
                items: [
                    { text: 'sojson', link: 'https://www.sojson.com' },
                    { text: '时间戳', link: 'https://tool.lu/timestamp/' },
                ]
            },
            {
                text: 'PHP',
                activeMatch: '/php/*',
                link: '/php/'
            }
        ],
        // sidebar: [
        //     {
        //         text: 'Examples',
        //         items: [
        //             { text: 'Markdown Examples', link: '/markdown-examples' },
        //             { text: 'Runtime API Examples', link: '/api-examples' }
        //         ]
        //     },
        //     ...jsSidebar
        // ],
        sidebar: {
            '/php/': jsSidebar,
        },

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
        // 文档页脚文本配置
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        // editLink: {
        //     pattern: '路径地址',
        //     text: '对本页提出修改建议',
        // },
        // 多语言搜索配置

    }
})
