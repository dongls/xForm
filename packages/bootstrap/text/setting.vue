<template>
  <field-setting :field="field"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import FieldSetting from '../FieldSetting.vue'

export default defineComponent({
  name: 'xform-bs-text-setting',
  props: {
    field: XField
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>