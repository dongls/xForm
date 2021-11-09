<template>
  <div :class="`xform-el-field-setting xform-el-${fieldRef.type}-setting`">
    <h3 class="xform-el-field-setting-head">{{ field.conf.title }}</h3>

    <section class="xform-el-field-setting-prop">
      <header>标题：</header>
      <el-input size="small" placeholder="[必填] 请输入标题..." v-model="fieldRef.title"/>
    </section>

    <section class="xform-el-field-setting-prop" v-if="placeholder">
      <header>提示：</header>
      <el-input type="textarea" size="small" placeholder="[可选] 请输入提示信息..." rows="3" v-model="fieldRef.placeholder"/>
    </section>

    <section class="xform-el-field-setting-prop" v-if="attributes">
      <header>属性：</header>
      <el-checkbox size="small" v-if="required" v-model="fieldRef.required" :name="`${field.name}-required`" title="勾选则该字段在表单提交时必须填写">必填</el-checkbox>
      <el-checkbox size="small" v-model="fieldRef.disabled" :name="`${field.name}-disabled`" title="勾选则该字段在表单中无法编辑, 也不参与表单验证">禁用</el-checkbox>
      <el-checkbox size="small" v-model="fieldRef.hidden" :name="`${field.name}-hidden`" title="勾选则该字段将不会再表单中显示">隐藏</el-checkbox>
      <slot name="attributes"/>
    </section>

    <slot/>
    <field-logic v-model:field="fieldRef" v-if="allowLogic"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { FormField } from '@dongls/xform'

import FieldLogic from './FieldLogic.vue'

export default defineComponent({
  name: 'field-setting',
  props: {
    field: {
      type: FormField,
      required: true
    },
    placeholder: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    },
    logic: {
      type: Boolean,
      default: true
    },
    attributes: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const fieldRef = toRef(props, 'field')
    // const allowLogic = computed(() => getConfig().logic === true)
    const allowLogic = false

    return { fieldRef, allowLogic }
  },
  components: {
    [FieldLogic.name]: FieldLogic
  }
})
</script>

<style lang="scss">
.xform-el-field-setting-head{
  margin: 0;
  line-height: 24px;
  font-size: 16px;
  border-bottom: 1px solid rgba(0,0,0,.125);
  font-weight: 700;
  padding: 0 0 3px 0;
  margin-bottom: 10px;
}

.xform-el-field-setting-prop{
  margin-bottom: 15px;
}

.xform-el-field-setting-prop > header{
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 5px;
}
</style>