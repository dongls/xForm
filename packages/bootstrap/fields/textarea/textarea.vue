<template>
  <textarea 
    v-model="value"
    :id="field.uid"
    rows="3"
    :name="field.name"
    class="form-control form-control-sm"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@bootstrap/util'

export default defineComponent({
  name: 'xform-bs-textarea',
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
    return { 
      value: useValue<string>() 
    }
  }
})
</script>
