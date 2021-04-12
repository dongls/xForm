<template>
  <field-setting :field="field"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import FieldSetting from '../FieldSetting.vue'

export default defineComponent({
  name: 'xform-bs-textarea-setting',
  props: {
    field: FormField
  },
  components: { 
    [FieldSetting.name]: FieldSetting
  }
})
</script>