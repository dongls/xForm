<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import { updateField } from '../util'

export default defineComponent({
  name: 'xform-bs-text-setting',
  props: {
    field: XField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    return { updateField: updateField.bind(null, emit) }
  }
})
</script>

<template>
  <h3 class="xform-setting-head">单行文本</h3>

  <section class="xform-setting">
    <header>标题：</header>
    <input :value="field.title" type="text" class="form-control form-control-sm" placeholder="请输入标题..." @input="updateField($event, 'title')">
  </section>

  <section class="xform-setting">
    <header>提示：</header>
    <textarea :value="field.placeholder" class="form-control form-control-sm" placeholder="请输入提示信息..." rows="3" @input="updateField($event, 'placeholder')"/>
  </section>

  <section class="xform-setting">
    <header>属性：</header>
    <div class="custom-control custom-checkbox">
      <input :id="`${field.name}-required`" :name="`${field.name}-required`" :checked="field.required" type="checkbox" class="custom-control-input" @input="updateField($event, 'required')">
      <label class="custom-control-label" :for="`${field.name}-required`">必填</label>
    </div>
  </section>
</template>