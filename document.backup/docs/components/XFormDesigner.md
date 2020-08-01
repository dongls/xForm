# XFormDesigner  表单设计器
该组件提供了一个图形化的表单设计器，用户可以通过拖拽的方式快速配置出表单。
## 基本用法

```html
<template>
  <xform-designer v-model:schema="schema">
    <template #tool><!-- 用于定制顶部工具条 --></template>
    <template #setting><!-- 用于定制表单设置 --></template>
    <template #setting_type_text><!-- 用于定制字段类型为text的字段设置 --></template>
    <template #setting_name_test><!-- 用于定制字段name为test的字段设置 --></template>
  </xform-designer>
</template>

<script>
import { createSchema } from '@dongls/xform';

export default {
  setup(){
    return {
      schema: createSchema()
    }
  }
}
</script>
```

## Props
### schema
- **类型**：`XFormSchema`<is-link path="/doc/model#XFormSchema"></is-link>
- **说明**：设计器生成的表单配置，**必须提供**。 你可以使用`createSchema`方法创建它或者通过其他方式自行创建。需要注意的是，**`fields`的类型必须是`XField[]`**。
  ```javascript
  import {createSchema} from '@dongls/xform';
  const schema = createSchema({/* 传入你的数据 */});

  // 如果是通过其他方式创建的对象，需要将fields做类型转换
  schema.fields = schema.fields.map(f => f instanceof XField ? f : new XField(f))
  ```

### mode
- **类型**：`string`
- **默认值**：`null`
- **说明**：如果您希望组件**在不同的场景下展示不同的字段类型**，您可以通过配置`modes`来定义多种模式来满足您的需求。 如果该属性的值为`null`，那么将显示所有注册的字段类型。例如：
  ```javascript
  app.use(XForm, {
    config: {
      modes: { 
        example: [ // 字段类型分组
          { title: '分组1', types: ['type1', 'type2'] },
          { title: '分组2', types: ['type3', 'type4'] }
        ],
        simple: ['type1', 'type2', 'type4']
      }
    }
  });
  ```
  然后就可以在组件中使用`mode`属性来展示不同的字段类型。
  ```html
    <xform-designer mode="example"/>
    <xform-designer mode="simple"/>
  ```

## Slots

### tool
用于定义组件顶部工具条。
### setting
用于定制表单设置。需要注意的是，如果`preset.slots.setting`和该插槽都不存在的话，组件将不会显示表单设置。
### setting_name_[[target]]
根据字段的`name`属性定制某一个字段的设置组件。  
```html
<xform-designer>
  <template #setting_name_demo="{field}">
    <p>定制name值为demo的字段的设置组件</p>
  </template>
</xform-designer>
```
### setting_type_[[target]]
根据字段的`type`属性定制某一类型字段的设置组件。  
```html
<xform-designer v-model:schema="schema">
  <template #setting_type_text="{field}">
    <p>定制所有字段类型为text的字段的设置组件</p>
  </template>
</xform-designer>
```

## Events  
### update:schema
表单数据表更时触发。