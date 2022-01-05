<template>
  <input
    :id="field.uid"
    :name="field.name"
    type="date"
    v-model="value"
    class="form-control form-control-sm"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@bootstrap/util'

export default defineComponent({
  name: 'xform-bs-date',
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
