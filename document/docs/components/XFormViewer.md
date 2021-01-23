# XFormViewer 表单查看器
该组件主要用于根据`XFormDesigner`生成的表单配置展示`XFormBuilder`生成的表单数据，当然你也可以自行编写组件展示表单数据。

## 基本用法
```html
<template>
  <xform-viewer :model="model" :schema="schema" class="example-viewer">
    <template #name_demo>
      <p>name值为demo的字段会这么显示</p>
    </template>
    <template #type_text>
      <p>所有type为text的字段会这么显示</p>
    </template>
  </xform-viewer>
</template>

<script>
import { reactive } from 'vue';
import { createSchema } from '@dongls/xform';

export default {
  setup(){
    return {
      model: reactive({/* 表单数据 */}),
      schema: createSchema({/* 表单配置 */})
    }
  }
}
</script>
```

## Props
### schema
- **类型**：`XFormSchema`<is-link path="/doc/model#XFormSchema"></is-link>
- **说明**：表单的配置，数据来自表单设计器，**必须提供**。
### model
- **类型**：`object`
- **说明**：表单的数据，数据来自表单生成器，**必须提供**。

## Slots
### name_[[name]]
根据`name`的值定制某一个字段该如何显示，例如：
```html
<xform-viewer :model="model" :schema="schema" class="example-viewer">
  <template #name_demo>
    <p>name值为demo的字段会这么显示</p>
  </template>
</xform-viewer>
```
### type_[[type]]
根据`type`的值定制某一类型的字段该如何显示，例如：
```html
<xform-viewer :model="model" :schema="schema" class="example-viewer">
  <template #type_text>
    <p>所有type为text的字段会这么显示</p>
  </template>
</xform-viewer>
```