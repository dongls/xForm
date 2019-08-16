<template>
  <div class="xform-setting">
    <section class="xform-setting-group">
      <header>标题：</header>
      <el-input :value="field.title" @input="update('title', $event)" placeholder="请输入标题..."/>
    </section>
    <section class="xform-setting-group">
      <header>内容：</header>
      <el-input 
        type="textarea" :autosize="{minRows: 3, maxRows: 5}" 
        :value="field.attributes.content" @input="updateAttrs('content', $event)" 
        placeholder="请输入内容..."
      />
    </section>
    <section class="xform-setting-group">
      <header>属性：</header>
      <el-checkbox :value="!field.attributes.viewer" @input="updateAttrs('viewer', !$event)">仅表单可用</el-checkbox>
    </section>
  </div>
</template>

<script>
import {mixin} from '@src/index'

/**
 * TODO: 
 * 1. 支持markdown, 外部提供解析器
 * 2. 支持设置样式
 */
export default {
  name: 'xform-el-info-setting',
  mixins: [mixin.setting]
}
</script>