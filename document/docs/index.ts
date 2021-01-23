export interface MenuRaw {
  name: string;
  path?: string;
  group?: boolean;
  subtitle?: string;
  document?: () => Promise<any>;
  hidden: boolean;
}

export default [
  {
    name: '基础',
    group: true
  },
  {
    name: '介绍',
    path: '/doc/introduction',
    document: () => import('./introduction.md')
  },
  {
    name: '快速上手',
    path: '/doc/quickstart',
    document: () => import('./quickstart.md')
  },
  // {
  //   name: '概念',
  //   path: '/doc/concept',
  //   document: () => import('./concept.md'),
  //   hidden: true
  // },
  // {
  //   name: '组件',
  //   group: true
  // },
  // {
  //   name: 'XFormDesigner',
  //   path: '/doc/XFormDesigner',
  //   subtitle: '表单设计器',
  //   document: () => import('./components/XFormDesigner.md')
  // },
  // {
  //   name: 'XFormBuilder',
  //   path: '/doc/XFormBuilder',
  //   subtitle: '表单生成器',
  //   document: () => import('./components/XFormBuilder.md')
  // },
  // {
  //   name: 'XFormViewer',
  //   path: '/doc/XFormViewer',
  //   subtitle: '表单查看器',
  //   document: () => import('./components/XFormViewer.md')
  // },
  // {
  //   name: 'XFormItem',
  //   path: '/doc/XFormItem',
  //   subtitle: '表单项',
  //   document: () => import('./components/XFormItem.md')
  // },
  // {
  //   name: '其他',
  //   group: true
  // },
  // {
  //   name: '类型定义',
  //   path: '/doc/model',
  //   document: () => import('./model.md')
  // },
] as MenuRaw[];