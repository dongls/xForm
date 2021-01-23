import { PROPS } from './model/constant'

// vue@3.x里render函数改为使用扁平化数据格式（flat structure）
// 不再支持 `domProps: {}`, 导致无法在元素上添加非标准属性
// vue@3.x使用 `key in el` 判定`key`应该是用作`property`或者`attribute`
// 考虑到这个判定机制，在此处扩展HTMLElement的原型，用于将特定的key作为`property`处理
// 这样做会污染HTMLElement的原型，期待未来vue@3.x能解决这个问题

// https://github.com/vuejs/rfcs/blob/master/active-rfcs/0008-render-function-api-change.md
// https://github.com/vuejs/vue-next/blob/0a6105f8ce4fb6f91947fb9764aae8eec1aded10/packages/runtime-dom/src/patchProp.ts#L112
const descriptor = { writable: true }
Object.values(PROPS).forEach(prop => Object.defineProperty(HTMLElement.prototype, prop, descriptor))
