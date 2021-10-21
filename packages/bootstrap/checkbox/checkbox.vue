<template>
  <div class="xform-bs-checkbox">
    <div v-for="(option, i) in field.options" :key="i" :class="radioClassName">
      <input 
        v-model="value" 
        :id="field.uid + '_' + i" 
        :name="field.name" 
        :value="option.value"  
        type="checkbox" 
        class="custom-control-input"
        :disabled="disabled || field.disabled"
      >
      <label class="custom-control-label" :for="field.uid + '_' + i">{{ option.value }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '../util'

export default defineComponent({
  name: 'xform-bs-checkbox',
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
  setup(props) {
    return {
      value: useValue<string[]>([]),
      radioClassName: computed(() => {
        const className = ['custom-control', 'custom-checkbox']
        if(props.field.attributes.layout == 'inline') className.push('custom-control-inline')
        return className
      })
    }
  }
})
</script>

<style>
.xform-bs-checkbox {
  padding: 5px 0;
}

.xform-bs-checkbox .custom-checkbox{
  line-height: 24px;
}
</style>