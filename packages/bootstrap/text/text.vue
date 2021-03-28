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
import { useValue, XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-text',
  props: {
    field: {
      type: XField,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props){
    return { value: useValue<string>(props) }
  }
})
</script>
