---
sidebarDepth: 0
---

# XFormDesigner
---
该组件提供了一个图形化的表单设计器，用户可以通过拖拽的方式快速配置出表单。

## 简单示例
```html
<template>
  <xform-designer v-model="fields" mode="example">
    <template #tool><!-- tool slot--></template>
  </xform-designer>
</template>

<script>
export default{
  name: 'designer',
  data(){
    return {
      fields: [/* some fields*/]
    }
  }
}
</script>
```

## Props
### value
- **类型**：`Array<XField>`
- **默认值**：`[]`
- **说明**：组件的字段数据，每一项都应该是`XField`类型。建议对源数据做如下操作，以保证格式。
```javascript
const fields = originData.map(f => f instanceof XField ? f : new XField(f));
```
### mode
- **类型**：`String`
- **默认值**：`null`
- **说明**：如果您希望组件**在不同的场景下展示不同的字段类型**，您可以通过配置`modes`来定义多种模式来满足您的需求。 如果不定义该属性或者没有匹配的数据，那么将显示所有注册的字段类型。一个简单的例子如下所示：
  ```javascript
  Vue.use(XForm, {
    // 这里定义了两种不同的mode
    modes: {
      example: {
        {
          group: '基础字段',
          types: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date']
        },
        {
          group: '辅助字段',
          types: ['divider', 'info']
        }
      },
      simple: ['text', 'textarea', 'number', 'select']
    }
  })
  ```
  然后就可以在`XFormDesigner`中使用`mode`属性来展示不同的字段类型。
  ```html
    <xform-designer mode="example"/>
    <xform-designer mode="simple"/>
  ```
## Slot
### tool
用于自定义组件顶部工具条。
### 可扩展插槽
如果您希望在某些特定场景下定制字段类型的表现形式，而不影响其他地方，您可以通过`slot`来实现。`XFormDesigner`目前支持以下特定命名格式的`slot`：
  - `type_$type_$target`：用于定制某一字段类型的`preview`或`setting`组件。  
    `$type`是指字段类型，值取字字段类型的`type`属性。  
    `$target`是指定制目标， 值取`preview`、`setting`之一。
    ```html
    <xform-designer v-model="fields">
      <template #type_text_preview>
        <p>定制字段类型为text的字段在设计器中的预览方式</p>
      </template>
    </xform-designer>
    ```