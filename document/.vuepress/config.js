
module.exports = {
  port: 9000,
  dest: './docs',
  title: 'xForm',
  // description: 'Just playing around',
  // head: [
  //   ['link', { rel: 'icon', href: '/logo.png' }]
  // ],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '配置', link: '/config/' },
      { text: '示例', link: 'https://xform.imdo.me/example/index.html' }
    ],
    sidebar: {
      '/guide/': [
        '',
      ],

      '/config/': [
        ''
      ],

      '/': [
        ''
      ]
    },
    lastUpdated: '上次更新'
  }
}