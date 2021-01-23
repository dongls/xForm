# 概念

通常来说，对于表单设计器，需要提供以下配置：
- **表单设置组件** - 用于设置表单的属性，通过`preset.slots.setting`或者name为`setting`的`slot`提供。
- **字段预览组件** - 用于预览字段，通过以下位置：`FieldConf.preview`，`FieldConf.build`按顺序提供。
- **字段设置组件** - 用于设置字段的属性，通过`FieldConf.setting`提供。
