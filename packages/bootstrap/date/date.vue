<script lang="ts">
import { defineComponent } from 'vue'
import { useValue, XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-date',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props: any){
    return { value: useValue<string>(props) }
  }
})
</script>

<template>
  <input
    :id="field.uid"
    :name="field.name"
    type="date"
    v-model="value"
    class="form-control form-control-sm"
    :placeholder="field.placeholder"
  >
</template>