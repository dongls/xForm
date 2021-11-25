<template>
  <div :class="`xform-bs-field-setting xform-bs-${fieldRef.type}-setting`">
    <h3 class="xform-bs-field-setting-head">{{ field.conf.title }}</h3>

    <section class="xform-bs-field-setting-prop">
      <header>标题：</header>
      <input type="text" class="form-control form-control-sm" placeholder="[必填] 请输入标题..." v-model="fieldRef.title">
      <slot name="title"/>
    </section>

    <section class="xform-bs-field-setting-prop" v-if="placeholder">
      <header>提示：</header>
      <textarea class="form-control form-control-sm" placeholder="[可选] 请输入提示信息..." rows="3" v-model="fieldRef.placeholder"/>
    </section>

    <section class="xform-bs-field-setting-prop" v-if="attributes">
      <header>属性：</header>
      <div v-if="required" class="form-check form-check-inline">
        <input :id="`${field.name}-required`" :name="`${field.name}-required`" type="checkbox" class="form-check-input" v-model="fieldRef.required">
        <label class="form-check-label" :for="`${field.name}-required`" title="勾选则该字段在表单提交时必须填写">必填</label>
      </div>
      <div class="form-check form-check-inline">
        <input :id="`${field.name}-disabled`" :name="`${field.name}-disabled`" type="checkbox" class="form-check-input" v-model="fieldRef.disabled">
        <label class="form-check-label" :for="`${field.name}-disabled`" title="勾选则该字段在表单中无法编辑, 也不参与表单验证">禁用</label>
      </div>
      <div class="form-check form-check-inline">
        <input :id="`${field.name}-hidden`" :name="`${field.name}-hidden`" type="checkbox" class="form-check-input" v-model="fieldRef.hidden">
        <label class="form-check-label" :for="`${field.name}-hidden`" title="勾选则该字段将不会再表单中显示">隐藏</label>
      </div>
      <slot name="attributes"/>
    </section>

    <slot/>

    <field-logic v-model:field="fieldRef" v-if="allowLogic"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import { FormField, getConfig, } from '@dongls/xform'

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
    const allowLogic = computed(() => getConfig().logic === true)

    return { fieldRef, allowLogic }
  },
  components: {
    [FieldLogic.name]: FieldLogic
  }
})
</script>

<style lang="scss">
.xform-bs-field-setting-head{
  margin: 0;
  line-height: 24px;
  font-size: 16px;
  border-bottom: 1px solid rgba(0,0,0,.125);
  font-weight: 700;
  padding: 0 0 3px 0;
  margin-bottom: 10px;
}

.xform-bs-field-setting-prop + .xform-bs-field-setting-prop{
  margin-top: 15px;
}

.xform-bs-field-setting-prop > header{
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 5px;
}
</style>