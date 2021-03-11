<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useValue, XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-select',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props) {
    const value = useValue<string>(props, '')
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

<template>
  <select
    :id="field.uid"
    v-model="value"
    :name="field.name"
    :class="className"
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