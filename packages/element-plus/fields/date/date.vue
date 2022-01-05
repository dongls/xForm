<template>
  <el-date-picker
    v-model="value"
    :name="field.name"
    :placeholder="field.placeholder"
    :disabled="disabled || field.disabled"
    :format="field.attributes.format"
    :value-format="field.attributes.valueFormat"
    :editable="false"
    :popper-options="popperOptions"
    class="xform-el-date"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { useValue } from '@element-plus/util'

export default defineComponent({
  name: 'xform-el-date',
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
      value: useValue<string>(),
      popperOptions: {
        placement: 'bottom-start'
      }
    }
  }
})
</script>

<style lang="scss">
.xform-el-date{
  width: 100% !important;
}
</style>