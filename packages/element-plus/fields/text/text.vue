<template>
  <el-input 
    v-model="value"
    :id="field.uid"
    :name="field.name"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
    class="xform-el-text"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@element-plus/util'

export default defineComponent({
  name: 'xform-el-text',
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
  setup(){
    return { value: useValue<string>() }
  }
})
</script>
