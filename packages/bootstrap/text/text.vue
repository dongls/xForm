<template>
  <input
    :id="field.name"
    :name="field.name"
    type="text"
    :value="value"
    :class="clasName"
    :placeholder="field.placeholder"
    @input="updateValue"
  >
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { XField } from '@dongls/xform'
import { updateValue } from '../util'

export default defineComponent({
  name: 'xform-bs-text',
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
    return { 
      updateValue: updateValue.bind(null, emit, props.field.name),
      clasName: computed(() => {
        return {
          'form-control': true,
          'form-control-sm': true,
          'is-invalid': props.field.valid == 'error'
        }
      })
    }
  }
})
</script>
