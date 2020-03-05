# xForm
Vue驱动的自定义表单套件。**当前处于早期开发阶段，所有`api`皆可能发生变动，请勿在生产环境使用。** 该项目灵感来源于以下两处：
- 钉钉审批管理中的表单设计器
- [formbuilder](https://github.com/dobtco/formbuilder)

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

## 待办事项
- [ ] **[新字段]** 开关(switch)
- [ ] **[FormDesigner]** 对输出的字段进行验证
- [ ] **编写文档**
- [ ] **测试**
- [ ] 集成[`iView`](https://github.com/iview/iview)

## License
[MIT](LICENSE)