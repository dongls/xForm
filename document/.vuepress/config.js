module.exports = {
  port: 9000,
  dest: './docs',
  title: 'xForm',
  // description: 'Just playing around',
  // head: [
  //   ['link', { rel: 'icon', href: '/logo.png' }]
  // ],
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'xForm',
      description: 'Vue-powered Static Site Generator'
    }
  },
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      // { text: '配置', link: '/config/' },
      { text: '示例', link: 'https://xform.imdo.me/example/index.html' },
      { text: 'GitHub', link: 'https://github.com/dongls/xForm' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: '基础',   
          collapsable: false,
          children: [
            '',
            'quickstart',
            'theme'
          ]
        },
        {
          title: "组件",
          collapsable: false,
          children: [
           'components/XFormDesigner',
           'components/XFormBuilder',
           'components/XFormViewer',
           'components/XFormItem'
          ]
        },
        {
          title: '字段',   
          collapsable: false,
          children: [
            'fields/text',
            'fields/textarea',
            'fields/number',
            'fields/select',
            'fields/radio',
            'fields/checkbox',
            'fields/date',
            'fields/divider',
            'fields/info',
          ]
        },
        {
          title: '进阶',
          collapsable: false,
          children: [
            "advanced/create-new-field-type"
          ]
        },
        {
          title: '其他',
          collapsable: false,
          children: [
            'other/element-ui'
          ]
        }
      ]
      
    },
    lastUpdated: '上次更新'
  },
  plugins: [
    ['@vuepress/last-updated', {
      transformer(timestamp, lang){
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = date.getMonth() >= 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
        const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
        const minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
        const second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
    }]
  ],
  markdown: {
    extendMarkdown(md){
      md.use(require('markdown-it-task-lists'))
    }
  }
}