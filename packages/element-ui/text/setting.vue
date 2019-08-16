<template>
  <div class="xform-setting">
    <h3 class="xform-setting-head">单行文本</h3>
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
    </section>
  </div>
</template>

<script>
import {mixin} from '@src/index';

export default {
  name: 'xform-el-text-setting',
  mixins: [mixin.setting]
}
</script>