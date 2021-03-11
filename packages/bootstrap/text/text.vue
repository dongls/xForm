<template>
  <input
    :id="field.uid"
    v-model="value"
    :name="field.name"
    type="text"
    class="form-control form-control-sm"
    :placeholder="field.placeholder"
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
    }
  },
  setup(props){
    return { value: useValue<string>(props) }
  }
})
</script>
