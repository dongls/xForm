<template>
  <xform-setting :field="field"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-textarea-setting',
  props: {
    field: XField
  }
})
</script>