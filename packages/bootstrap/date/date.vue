<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { useField, XField } from '@dongls/xform'
import { updateValue } from '../util'

export default defineComponent({
  name: 'xform-bs-date',
  props: {
    field: {
      type: XField,
      required: true
    },
    value: {
      type: String,
      default: null
    }
  },
  setup(props: any, { emit }){
    const instance = getCurrentInstance()
    const detail = {
      key: props.field.name,
      field: props.field,
      prop: props.field.name,
    }

    useField(instance, detail)
    return { updateValue: updateValue.bind(null, emit, props.field.name) }
  }
})
</script>

<template>
  <input
    :id="field.name"
    :name="field.name"
    type="date"
    :value="value"
    class="form-control form-control-sm"
    :placeholder="field.placeholder"
    @input="updateValue"
  >
</template>