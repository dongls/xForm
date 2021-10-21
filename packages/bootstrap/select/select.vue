<template>
  <select
    v-model="value"
    :id="field.uid"
    :name="field.name"
    :class="className"
    :disabled="disabled || field.disabled"
  >
    <option class="xform-bs-is-placeholer" value="">---- {{ field.placeholder || '请选择' }} ----</option>
    <option 
      v-for="option in field.options" 
      :key="option.value" 
      :value="option.value"
    >
      {{ option.value }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '../util'

export default defineComponent({
  name: 'xform-bs-select',
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
  setup() {
    const value = useValue<string>('')
    return {
      value,
      className: computed(() => {
        return {
          'custom-select': true,
          'custom-select-sm': true,
          'xform-bs-select': true,
          'xform-bs-is-empty': null == value || (typeof value.value == 'string' && value.value.length == 0)
        }
      })
    }
  }
})
</script>

<style>
.xform-bs-is-empty{
  color: #6c757d;
}

.xform-bs-select option{
  color: #495057;
}

.xform-bs-select  option.xform-bs-is-placeholer{
  color: #6c757d;
}
</style>