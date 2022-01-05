<template>
  <el-checkbox-group 
    v-model="value" 
    :disabled="disabled || field.disabled"
    :class="className"
  >
    <el-checkbox
      v-for="(option, index) in field.options" :key="index"
      :label="option.value"
      :name="field.name"
    />
  </el-checkbox-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@element-plus/util'

export default defineComponent({
  name: 'xform-el-checkbox',
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
      className: computed(() => {
        const className = ['xform-el-checkbox']
        if(props.field.attributes.layout == 'block') {
          className.push('xform-el-checkbox-block')
        }
        return className
      })
    }
  }
})
</script>

<style>
.xform-el-checkbox-block .el-checkbox{
  width: fit-content;
  margin: 0;
  display: flex;
  white-space: normal;
}
</style>