# xForm
基于[Vue@3.2+][vue]的动态表单生成器。[在线示例][doc]

> `xForm`使用了诸如`expose`、`.prop`之类的api, **请确保你的`Vue`版本不低于3.2.0**。

## 更新计划 `v0.8.0`
- [x] 支持[Element Plus][element]
- [x] Bootstrap升级至5.x
- [x] 设计器支持边缘滚动
- [x] `FieldConf`更名为`Field`

## 兼容性
`xForm`使用了诸如`Proxy`、`Reflect`之类的新特性，因此需要浏览器至少实现了`ES2015`标准。需要注意的是，`xForm`**不支持IE浏览器，也没有相关的支持计划**。

## FAQ
### 文档
`xForm`当前还在开发中，可能会产生各种**不兼容**的情况，等正式版发布时一同发布文档。有关`xForm`的用法可参照在线示例的[源码][example]或者相关[测试用例][test]

## 字段库
`xForm`本身并**不提供具体字段类型的实现**，也**不针对特定业务需求提供实现**。考虑到具体业务场景的多样化，`xForm`也无法一一满足这些要求，因此推荐**自行实现字段库**。通过这种方式可以实现
- 使用适合的UI库
- 完全控制每一种字段，满足自身的需求

当然这么做需要花费更多的时间，`xForm`提供了以下几个基础的字段库，可以自行参考或直接使用：
- [Element Plus](packages/element-plus)
- [Bootstrap](packages/bootstrap)

## License
[MIT](LICENSE)

[vue]: https://github.com/vuejs/vue-next
[doc]: https://dongls.github.io/xForm/
[example]: https://github.com/dongls/xForm/tree/master/document/views/example
[test]: https://github.com/dongls/xForm/tree/master/packages/core/__test__

[element]: https://github.com/element-plus/element-plus