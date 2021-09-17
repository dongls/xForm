# xForm
基于[Vue@3.x][vue]的动态表单生成器。[在线示例][doc]

## 更新计划 `v0.7.0`
- [x] 字段类型: 子表单`subform`
- [x] 表单禁用、字段隐藏
- [x] 逻辑表单
- [ ] 支持设置默认值

## 兼容性
`xForm`使用了诸如`Proxy`、`Reflect`之类的新特性，因此需要浏览器至少实现了`ES2015`标准。需要注意的是，`xForm`**不支持IE浏览器，也没有相关的支持计划**。如果你有这方面的需求，建议使用其他优秀的库。

## FAQ
### 文档
`xForm`当前还在开发中，可能会产生各种**不兼容**的情况，等正式版发布时一同发布文档。有关`xForm`的用法可参照在线示例的[源码][example]或者相关[测试用例][test]

## License
[MIT](LICENSE)

[vue]: https://github.com/vuejs/vue-next
[doc]: https://dongls.github.io/xForm/
[example]: https://github.com/dongls/xForm/tree/master/document/views/example
[test]: https://github.com/dongls/xForm/tree/master/packages/core/__test__