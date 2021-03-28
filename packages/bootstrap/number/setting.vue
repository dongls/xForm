<template>
  <xform-setting :field="field">
    <template #properties>
      <div class="custom-control custom-checkbox custom-control-inline" title="勾选则只允许输入整数">
        <input :id="`${field.name}-integer`" :name="`${field.name}-integer`" :checked="field.attributes.integer" type="checkbox" class="custom-control-input" @change="updateField($event, 'integer', 'attributes')">
        <label class="custom-control-label" :for="`${field.name}-integer`">整数</label>
      </div>
    </template>
  </xform-setting>
</template>

<script lang="ts">
import { XField } from '@dongls/xform'
import { defineComponent } from 'vue'
import { updateField } from '../util'

export default defineComponent({
  name: 'xform-bs-number-setting',
  props: {
    field: XField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    return { updateField: updateField.bind(null, emit) }
  }
})
</script>
