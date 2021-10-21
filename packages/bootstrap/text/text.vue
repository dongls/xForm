<template>
  <input
    v-model="value"
    :id="field.uid"
    :name="field.name"
    type="text"
    class="form-control form-control-sm"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '../util'

export default defineComponent({
  name: 'xform-bs-text',
  props: {
    field: {
      type: FormField,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(){
    return { value: useValue<string>() }
  }
})
</script>
