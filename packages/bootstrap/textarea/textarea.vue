<script lang="ts">
import { defineComponent } from 'vue'
import { useValue, XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-textarea',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props){
    return { value: useValue(props) }
  }
})
</script>

<template>
  <textarea 
    :id="field.uid" 
    v-model="value" 
    rows="3" 
    :name="field.name" 
    class="form-control form-control-sm" 
    :placeholder="field.placeholder"
  />
</template>