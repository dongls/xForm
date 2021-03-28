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
import { useValue, XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-textarea',
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
    return { value: useValue(props) }
  }
})
</script>
