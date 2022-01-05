<template>
  <el-select
    :name="field.name"
    :disabled="disabled || field.disabled"
    :placeholder="field.placeholder"
    v-model="value"
    class="xform-el-select"
    clearable
  >
    <el-option 
      v-for="(option, index) in field.options" :key="index" 
      :value="option.value" 
      :label="option.value"
    />
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@element-plus/util'

export default defineComponent({
  name: 'xform-el-select',
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
    return {
      value: useValue<string>()
    }
  }
})
</script>

<style>
.xform-el-select{
  width: 100%;
}
</style>