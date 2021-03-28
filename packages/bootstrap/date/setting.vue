<template>
  <xform-setting :field="field" :placeholder="false"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'

export default defineComponent({
  name: 'xform-bs-date-setting',
  props: {
    field: XField
  }
})
</script>
