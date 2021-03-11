<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useValue, XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-checkbox',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props) {
    return {
      value: useValue<string[]>(props, []),
      radioClassName: computed(() => {
        const className = ['custom-control', 'custom-checkbox']
        if(props.field.attributes.layout == 'inline') className.push('custom-control-inline')
        return className
      })
    }
  }
})
</script>

<template>
  <div class="xform-bs-checkbox">
    <div v-for="(option, i) in field.options" :key="i" :class="radioClassName">
      <input 
        :id="field.uid + '_' + i" 
        v-model="value" 
        :name="field.name" 
        :value="option.value"  
        type="checkbox" 
        class="custom-control-input"
      >
      <label class="custom-control-label" :for="field.uid + '_' + i">{{ option.value }}</label>
    </div>
  </div>
</template>

<style>
.xform-bs-checkbox {
  padding: 5px 0;
}

.xform-bs-checkbox .custom-checkbox{
  line-height: 24px;
}
</style>