<script lang="ts">
import { defineComponent, computed } from 'vue'
import { XField } from '@dongls/xform'
import { updateValue } from '../util'

export default defineComponent({
  name: 'xform-bs-radio',
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
    return {
      updateValue: updateValue.bind(null, emit, props.field.name),
      radioClassName: computed(() => {
        const className = ['custom-control', 'custom-radio']
        if(props.field.attributes.layout == 'inline') className.push('custom-control-inline')
        return className
      })
    }
  }
})
</script>

<template>
  <div class="xform-bs-radio">
    <div v-for="(option, i) in field.options" :key="i" :class="radioClassName">
      <input 
        :id="field.name + '_' + i" :name="field.name" 
        :value="option.value" :checked="value == option.value" 
        type="radio" 
        class="custom-control-input"
        @change="updateValue"
      >
      <label class="custom-control-label" :for="field.name + '_' + i">{{ option.value }}</label>
    </div>
  </div>
</template>

<style>
.xform-bs-radio {
  padding: 5px 0;
}

.xform-bs-radio .custom-radio{
  line-height: 24px;
}
</style>