<template>
  <div class="xform-setting xform-setting-column">
    <h3 class="xform-setting-head">多选框</h3>
    <section class="xform-setting-group">
      <header>标题：</header>
      <el-input :value="field.title" @input="update('title', $event)" placeholder="请输入标题..."/>
    </section>
    <section class="xform-setting-group">
      <header>帮助：</header>
      <el-input 
        type="textarea" :autosize="{minRows: 3, maxRows: 5}" 
        :value="field.help" @input="update('help', $event)" 
        placeholder="请输入说明信息..."
      />
    </section>
    <section class="xform-setting-group">
      <header>属性：</header>
      <el-checkbox :value="field.required" @input="update('required', $event)">必填</el-checkbox>
    </section>
    <section class="xform-setting-group">
      <header>布局：</header>
      <el-radio-group :value="field.attributes.layout || 'inline'" @input="updateAttrs('layout', $event)">
        <el-radio-button label="inline">行内</el-radio-button>
        <el-radio-button label="block">换行</el-radio-button>
        <el-radio-button label="button">按钮</el-radio-button>
      </el-radio-group>
    </section>
    <section class="xform-setting-group xform-setting-column-flex">
      <header>选项：</header>
      <div class="xform-el-setting-options">
        <div class="xform-el-setting-option" v-for="(option, i) in field.options" :key="i">
          <el-input placeholder="请输入选项内容" :value="option.value" @input="updateOption(option, $event)" size="mini"/>
          <button type="button" class="xform-el-setting-option-del" @click="delOption(option)"><i class="el-icon-minus"/></button>
        </div>
        <el-button type="text" @click="addOption" size="medium" icon="el-icon-plus">添加选项</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import {mixin} from '@dongls/xform';

export default {
  name: 'xform-el-select-setting',
  mixins: [mixin.setting],
  methods: {
    addOption(){
      const options = this.field.options;
      options.push({value: `选项${options.length + 1}`});

      this.update('options', options)
    },
    updateOption(option, value){
      const options = this.field.options;

      this.$set(option, 'value', value);
      this.update('options', options);
    },
    delOption(option){
      const options = this.field.options;
      const index = options.findIndex(o => o == option);
      options.splice(index, 1);

      this.update('options', options)
    }
  }
}
</script>