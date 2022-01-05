<template>
  <div class="xform-bs-radio">
    <div v-for="(option, i) in field.options" :key="i" :class="radioClassName">
      <input 
        v-model="value"
        :id="field.uid + '_' + i" 
        :name="field.name"
        :value="option.value" 
        type="radio" 
        class="form-check-input"
        :disabled="disabled || field.disabled"
      >
      <label class="form-check-label" :for="field.uid + '_' + i">{{ option.value }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@bootstrap/util'

export default defineComponent({
  name: 'xform-bs-radio',
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
      value: useValue<string>(),
      radioClassName: computed(() => {
        const className = ['form-check']
        if(props.field.attributes.layout == 'inline') className.push('form-check-inline')
        return className
      })
    }
  }
})
</script>

<style lang="scss">
.xform-bs-radio {
  padding: 5px 0;

  .form-check{
    font-size: 16px;
    margin-bottom: 0;
    line-height: 24px;

    & + .form-check{
      margin-top: 5px;
    }
  }

  .form-check-label{
    font-size: var(--xform-font-size);
  }

  .form-check-inline{
    margin-top: 0 !important;
  }
}
</style>