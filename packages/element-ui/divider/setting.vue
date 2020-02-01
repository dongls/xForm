<template>
  <div class="xform-setting">
    <h3 class="xform-setting-head">分割线</h3>
    <section class="xform-setting-group">
      <header>标题：</header>
      <el-input :value="field.title" @input="update('title', $event)" placeholder="请输入标题..."/>
    </section>
    <!-- <section class="xform-setting-group">
      <header>布局：</header>
      <el-radio-group :value="field.attributes.layout || 'left'" @input="updateAttrs('layout', $event)">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="center">居中</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
      </el-radio-group>
    </section> -->
    <section class="xform-setting-group xform-el-divider-setting-types">
      <header>样式：</header>
      <el-radio-group :value="field.attributes.type || 'solid'" @input="updateAttrs('type', $event)">
        <div class="xform-el-divider-setting-type">
          <el-radio label="solid"/>
          <xform-divider type="solid"/>
        </div>
        <div class="xform-el-divider-setting-type">
          <el-radio label="dashed"/>
          <xform-divider type="dashed"/>
        </div>
        <div class="xform-el-divider-setting-type">
          <el-radio label="double"/>
          <xform-divider type="double"/>
        </div>
        <div class="xform-el-divider-setting-type">
          <el-radio label="solid-dashed"/>
          <xform-divider type="solid-dashed"/>
        </div>
        <div class="xform-el-divider-setting-type">
          <el-radio label="dashed-solid"/>
          <xform-divider type="dashed-solid"/>
        </div>
      </el-radio-group>
    </section>
    <section class="xform-setting-group xform-el-divider-setting-types">
      <header>间距：</header>
      <div class="xform-el-divider-margin">
        <label>上间距：</label>
        <el-slider :value="field.attributes.top" @input="updateAttrs('top', $event)" :step="5" show-stops/>
      </div>
      <div class="xform-el-divider-margin">
        <label>下间距：</label>
        <el-slider :value="field.attributes.bottom" @input="updateAttrs('bottom', $event)" :step="5" show-stops/>
      </div>
    </section>
  </div>
</template>

<script>
import {mixin} from '@dongls/xform';
import divider from './divider.vue';

export default {
  name: 'xform-el-divider-setting',
  mixins: [mixin.setting],
  components: {
    [divider.name]: divider
  }
}
</script>