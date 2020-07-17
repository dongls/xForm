<script lang="ts">
import { defineComponent } from 'vue'
import { useLocalModel, useLocalSchema } from '../util/common'

export default defineComponent({
  name: 'viewer-view',
  setup(){
    const { value } = useLocalModel(true)
    const { schema } = useLocalSchema()

    return {
      model: value,
      schema
    }
  }
})
</script>

<template>
  <xform-viewer :model="model" :schema="schema" class="example-viewer">
    <!-- -->
  </xform-viewer>
</template>

<style>
.example-viewer{
  padding: 10px 0;
}
</style>
