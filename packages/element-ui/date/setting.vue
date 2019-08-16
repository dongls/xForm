<template>
  <div class="xform-setting">
    <h3 class="xform-setting-head">日期</h3>
    <section class="xform-setting-group">
      <header>标题：</header>
      <el-input :value="field.title" @input="update('title', $event)" placeholder="请输入标题..."/>
    </section>
    <section class="xform-setting-group">
      <header>提示：</header>
      <el-input 
        type="textarea" :autosize="{minRows: 3, maxRows: 5}" 
        :value="field.placeholder" @input="update('placeholder', $event)" 
        placeholder="请输入提示信息..."
      />
    </section>
    <section class="xform-setting-group">
      <header>属性：</header>
      <el-checkbox :value="field.required" @input="update('required', $event)">必填</el-checkbox>
      <el-checkbox :value="field.attributes.type === 'datetime'" @input="updateAttrs('type', $event ? 'datetime' : 'date')">时间</el-checkbox>
    </section>
  </div>
</template>

<script>
/** 
 * TODO: 
 * 1. 支持设置快捷选项
 */
import {mixin} from '@src/index';

export default {
  name: 'xform-el-date-setting',
  mixins: [mixin.setting]
}
</script>