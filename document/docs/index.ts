export interface MenuRaw {
  name: string;
  path?: string;
  group?: boolean;
  document?: () => Promise<any>
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
  }
] as MenuRaw[];