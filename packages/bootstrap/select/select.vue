<script lang="ts">
import { defineComponent, getCurrentInstance, computed } from 'vue'
import { XField, useField } from '@dongls/xform'
import { updateValue } from '../util'

export default defineComponent({
  name: 'xform-bs-select',
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
  emits: ['update:value'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const detail = {
      key: props.field.name,
      field: props.field,
      prop: props.field.name
    }

    useField(instance, detail)
    return {
      updateValue: updateValue.bind(null, emit, props.field.name),
      placeholder: computed(() => props.field.placeholder ? `---- ${ props.field.placeholder } ----` : ''),
      isEmpty: computed(() => null == props.value || (typeof props.value == 'string' && props.value.length == 0))
    }
  }
})
</script>

<template>
  <select
    :id="field.name"
    :name="field.name"
    class="form-control form-control-sm"
    :class="{'xform-bs-is-empty': isEmpty}"
    :value="value" @change="updateValue"
  >
    <option v-if="placeholder" class="xform-bs-is-placeholer" value>{{ placeholder }}</option>
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

option.xform-bs-is-placeholer{
  color: #6c757d;
}
</style>