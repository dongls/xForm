# xForm
Vue驱动的自定义表单套件。**当前处于早期开发阶段，所有`api`皆可能发生变动，请勿在生产环境使用。** 该项目灵感来源于以下两处：
- 钉钉审批管理中的表单设计器
- [formbuilder](https://github.com/dobtco/formbuilder)

## 为什么要重复造轮子
首先，作者之前也想找到一个能够自行设计表单的开源库，可惜的是最后没有找到合适的。再然后就是将自己对于`Vue`的理解做一个技术总结，也不枉自己近些年的工作经验。此项目的核心理念是**除核心机制外皆可自定义**，开发者能够通过一定的配置满足的自己的需求，而不需要各种黑魔法对第三方库进行魔改。

## 这轮子有什么特别
- 灵活度高，除核心组件外皆可自行替换
- 自带可视化设计器
- 提供多样化的配置
- 集成流行的UI库（目前只集成了`ElementUI`）

## 核心组件
- XFormDesigner   可视化的表单设计组件
- XFormBuilder    基于JSON的表单构建组件
- XFormViewer     基于JSON的表单展示组件
- XFormItem       提供验证和布局机制的表单项组件

## 路线图
- [ ] 字段类型
  - [x] 说明文字(info)
  - [ ] 附件(file)
  - [ ] 开关(switch)
  - [ ] 地址(address)
  - [ ] 多级联动(cascader)
  - [ ] 电话(phone)
  - [ ] 邮箱(email)
- [ ] XFormDesigner
  - [x] 支持字段复制
  - [ ] 对输出的字段进行验证
- [ ] XFormBuilder
  - [x] 添加实时验证的配置，关闭则只在提交时验证
- [ ] 编写文档
- [ ] 测试
- [ ] 集成[`iView`](https://github.com/iview/iview)

## License
[MIT](LICENSE)