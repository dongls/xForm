<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { XField, useField } from '@dongls/xform'
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
    const instance = getCurrentInstance()
    const detail = {
      key: props.field.name,
      prop: props.field.name,
      field: props.field,
    }

    useField(instance, detail)
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