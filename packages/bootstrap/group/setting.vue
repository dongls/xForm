<template>
  <h3 class="xform-setting-head">分组</h3>
  <section class="xform-setting">
    <header>标题：</header>
    <input :value="field.title" type="text" class="form-control form-control-sm" placeholder="请输入标题..." @input="updateField($event, 'title')">
  </section>

  <section class="xform-setting">
    <header>属性：</header>
    <div class="custom-control custom-checkbox">
      <input 
        :id="`${field.name}-required`" 
        :name="`${field.name}-required`" 
        :checked="field.attributes.collapsable" 
        type="checkbox" 
        class="custom-control-input" 
        @input="updateField($event, 'collapsable', 'attributes')"
      >
      <label class="custom-control-label" :for="`${field.name}-required`">允许展开/收起</label>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import { updateField } from '../util'

export default defineComponent({
  name: 'xform-bs-group-setting',
  props: {
    field: XField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    return { 
      updateField: updateField.bind(null, emit) 
    }
  }
})
</script>