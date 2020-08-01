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
    <template #header>
      <h3 class="example-builder-title">笔记本电脑报修单</h3>
    </template>
    <xform-item name="address" title="地址">{{ model.address }}</xform-item>
  </xform-viewer>
</template>

<style>
.example-viewer{
  padding: 10px 0;
}
</style>
