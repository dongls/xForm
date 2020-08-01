<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import { updateValue } from '../util'

export default defineComponent({
  name: 'xform-bs-textarea',
  props: {
    field: {
      type: XField,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['update:value'],
  setup(props: any, { emit }){
    return { updateValue: updateValue.bind(null, emit, props.field.name) }
  }
})
</script>

<template>
  <textarea 
    :id="field.name" :name="field.name" :value="value"
    rows="3" class="form-control form-control-sm"
    :placeholder="field.placeholder"
    @input="updateValue"
  />
</template>