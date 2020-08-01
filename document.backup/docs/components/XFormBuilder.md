# XFormBuilder 表单生成器
该组件主要用于根据`XFormDesigner`生成的表单配置，渲染出对应的表单。

## 基本用法
```html
<template>
  <xform-builder ref="builder" v-model:value="value" :schema="schema" @submit.prevent="submit">
    <template #header><!-- 定制表单顶部内容 --></template>
    <template #footer><!-- 定制表单底部内容，比如可以把提交按钮放在这 --></template>
  </xform-builder>
</template>

<script>
import { reactive } from 'vue';
import { createSchema } from '@dongls/xform';

export default {
  setup(){
    const instance = getCurrentInstance();

    return {
      schema: createSchema({ /* 表单配置 */ }),
      value: reactive({ /* 表单数据 */ }),
      submit(){ 
        const builder = instance.refs.builder;

        return builder.validate().then(res => {
          if(res.valid) { /* do submit */}
        });
      }
    }
  }
}
</script>
```

## Props
### *schema*
- **类型**：`XFormSchema`<is-link path="/doc/model#XFormSchema"></is-link>
- **说明**：表单的配置，数据来自表单设计器，**必须提供**。
### *value*
- **类型**：`object`
- **说明**：表单的值，**必须提供**。
### tag
- **类型**：`string`,
- **默认值**：`form`,
- **说明**：如果您想让`XFormBuilder`渲染为其他标签，比如将该组件作为放入一个已存在`form`表单中，就需要修改`tag`的值。

## Slots
### header
用于定义组件顶部内容，例如您可以为表单添加一个标题。
### footer
用于定义组件底部内容，例如您可以将表单提交按钮放在此处。
### name_[[name]]
根据字段的`name`属性定制某一个字段的表单组件，例如：  
```html
<xform-builder>
  <template #name_example>
    <input type="text" placeholder="name值为example的字段会如此渲染"/>
  </template>
</xform-builder>
```
### type_[[type]]
根据字段的`type`属性定制某一类字段类型的表单组件，例如：
```html
<xform-builder>
  <template #type_text>
    <input type="text" placeholder="所有type值为text的字段会如此渲染"/>
  </template>
</xform-builder>
```
## Events
### submit
当`tag`属性为`form`时，如果表单内存在提交按钮，会触发该原生事件。可以在此提交表单或者做其他需要的事情。

### update:schema
表单数据表更时触发。

### change
表单数据更新时触发。