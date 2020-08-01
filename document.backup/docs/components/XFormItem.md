# XFormItem
通常情况下，`XFormDesigner`、`XFormBuilder`和`XFormViewer`会默认使用该组件包裹每一个字段所对应的表单组件，**用于提供统一的布局和表单验证**。当你需要提供某些特殊的表单字段时，你需要使用该组件将字段包装，以便提供统一的验证。例如，需要在`XFormBuilder`中插入一些固定的表单字段：
```html
<xform-builder>
  <template #header>
    <xform-item :field="fieldA" validation>
      <input type="text" placeholder="这里放入你的表单字段"/>
    </xform-item>
    <xform-item :field="fieldB">
      <input type="text" placeholder="这里放入你的表单字段"/>
    </xform-item>
  </template>
</xform-builder>
```

## Props
### field
- **类型**：`XField`<is-link path="/doc/model#XField"></is-link>
- **说明**：字段配置。
### validation
- **类型**：`boolean | () => Promise`
- **说明**：字段配置。