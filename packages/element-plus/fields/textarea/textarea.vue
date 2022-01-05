<template>
  <el-input
    type="textarea"
    v-model="value"
    :id="field.uid"
    :name="field.name"
    :rows="3"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
    class="xform-el-textarea"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@element-plus/util'

export default defineComponent({
  name: 'xform-el-textarea',
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
    return { 
      value: useValue<string>() 
    }
  }
})
</script>
