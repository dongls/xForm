<template>
  <el-input-number
    :key="version"
    :id="field.uid"
    :name="field.name"
    :model-value="value"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
    controls-position="right"
    class="xform-el-number" size="small"
    @update:model-value="updateValue"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '../util'

export default defineComponent({
  name: 'xform-el-number',
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
  setup(props){
    const version = ref(1)
    const value = useValue<Number>(NaN)

    function updateValue(v: any){
      const isInteger = props.field.attributes.integer === true
      if(!isInteger) return value.value = v
      
      value.value = Math.round(v)
      version.value++
    }

    return {
      value,
      version,
      updateValue
    }
  }
})
</script>

<style lang="scss">
.xform-el-number{
  width: 100%;
  user-select: none;

  .el-input__inner{
    text-align: left;
  }
}
</style>