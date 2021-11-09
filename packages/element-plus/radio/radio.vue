<template>
  <el-radio-group 
    v-model="value" 
    size="small" 
    :disabled="disabled || field.disabled"
    :class="className"
  >
    <el-radio
      v-for="(option, index) in field.options" :key="index"
      :label="option.value"
      :name="field.name"
    />
  </el-radio-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '../util'

export default defineComponent({
  name: 'xform-el-radio',
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
      className: computed(() => {
        const className = ['xform-el-radio']
        if(props.field.attributes.layout == 'block') {
          className.push('xform-el-radio-block')
        }
        return className
      })
    }
  }
})
</script>

<style>
.xform-el-radio-block .el-radio{
  width: fit-content;
  margin: 0;
  display: flex;
  white-space: normal;
}
</style>