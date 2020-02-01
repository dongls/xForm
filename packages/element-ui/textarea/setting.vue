<template>
  <div class="xform-setting">
    <h3 class="xform-setting-head">多行文本</h3>
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
    <!-- <section class="xform-setting-group">
      <header>默认值：</header>
      <input type="text" class="xform-setting-control" data-prop="defaultValue" :value="field.defaultValue" @input="updateProp">
    </section> -->
    <section class="xform-setting-group">
      <header>属性：</header>
      <el-checkbox :value="field.required" @input="update('required', $event)">必填</el-checkbox>
    </section>
  </div>
</template>

<script>
import {mixin} from '@dongls/xform';

export default {
  name: 'xform-el-textarea-setting',
  mixins: [mixin.setting]
}
</script>