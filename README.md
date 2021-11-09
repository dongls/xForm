# xForm
基于[Vue@3.2+][vue]的动态表单生成器。[在线示例][doc]

> `xForm`使用了诸如`expose`、`.prop`之类的api, **请确保你的`Vue`版本不低于3.2.0**。

## 更新计划 `v0.7.1`
- [ ] 支持[Element Plus][element]
  - [x] checkbox
  - [ ] datatable
  - [x] date
  - [x] divider
  - [x] group
  - [x] number
  - [x] radio
  - [x] select
  - [x] text
  - [x] textarea
  - [ ] tabs
- [ ] 字段逻辑支持读取字段选项
- [ ] 支持通过css custom-property自定义样式

## 兼容性
`xForm`使用了诸如`Proxy`、`Reflect`之类的新特性，因此需要浏览器至少实现了`ES2015`标准。需要注意的是，`xForm`**不支持IE浏览器，也没有相关的支持计划**。

## FAQ
### 文档
`xForm`当前还在开发中，可能会产生各种**不兼容**的情况，等正式版发布时一同发布文档。有关`xForm`的用法可参照在线示例的[源码][example]或者相关[测试用例][test]

## License
[MIT](LICENSE)

[vue]: https://github.com/vuejs/vue-next
[doc]: https://dongls.github.io/xForm/
[example]: https://github.com/dongls/xForm/tree/master/document/views/example
[test]: https://github.com/dongls/xForm/tree/master/packages/core/__test__

[element]: https://github.com/element-plus/element-plus