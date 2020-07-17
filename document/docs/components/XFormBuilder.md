---
sidebarDepth: 0
---

# XFormBuilder
---
该组件主要用于根据`XFormDesigner`生成的字段数据，渲染出对应的表单。

## 简单示例
<!-- todo: move to codepen -->
```html
<template>
  <xform-builder :fields="fields" :value="model" @input="update" @submit="submit">
    <template #top><header>示例</header></template>
    <template #bottom><button type="submit">提交</button></template>
  </xform-builder>
</template>

<script>
export default{
  name: 'builder',
  data(){
    return {
      fields: [/* some fields */],
      model: {}
    }
  },
  methods: {
    update(value){
      this.model = Object.assign({}, this.model, value);
    },
    submit(){
      // do something
    }
  }
}
</script>
```

## Props
### fields
- **类型**：`Array<XField>`
- **默认值**：`[]`
- **说明**： 组件的字段数据，每一项都应该是`XField`类型。建议对源数据做如下操作，以保证格式。
```javascript
const fields = originData.map(f => f instanceof XField ? f : new XField(f));
```
### value
- **类型**：`Object`
- **默认值**：`{}`
- **说明**：整个表单的值。如果某个表单项的值是在表单初始化之后添加的，这将无法被`Vue`观察，也无法触发视图更新。所以不建议使用`v-model`绑定该属性，而是监听`input`事件，手动更新。例如前面的示例中，在`input`事件如下操作：
```javascript
this.model = Object.assign({}, this.model, value);
```
### tag
- **类型**：`String`,
- **默认值**：`form`,
- **说明**：如果您想让`XFormBuilder`渲染为其他标签，比如您将该组件放入一个`form`表单中，您可以修改该属性。当`tag`的值为`form`时，该组件会监听原生`submit`事件，并对整个表单进行验证，如果验证通过，会触发`submit`事件。

## Event
### submit
当`tag`属性为`form`且表单验证通过时，会触发该事件。您可以在此提交表单或者做其他您需要的事情。
## Slot 
### top
用于定义组件顶部样式，例如您可以为表单添加一个标题。
### bottom
用于定义组件底部样式，例如您可以将表单提交按钮放在此处。
### 可扩展插槽
如果您希望在某些特定场景下定制字段类型的表现形式，而不影响其他地方，您可以通过`slot`来实现。`XFormBuilder`目前支持以下特定命名格式的`slot`：
  - name_$name: 用于定制某一个字段的表单组件。  
    $name是指该字段的字段名，取自该字段的`name`属性。
    ```html
    <xform-builder :fields="fields" :value="model" @input="update">
      <template #name_example>
        <input type="text" placeholder="name为example的字段会如此渲染"/>
      </template>
    </xform-builder>
    ```
  - type_$type：用于定制某一字段类型的表单组件。  
    $type是指字段类型，取自字段类型的`type`属性。
    ```html
    <xform-builder :fields="fields" :value="model" @input="update">
      <template #type_text>
        <input type="text" placeholder="字段类型为text的会如此渲染"/>
      </template>
    </xform-builder>
    ```