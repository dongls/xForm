<script lang="ts">
import { defineComponent } from 'vue'
import { useLocalSchema } from '@document/util/common'

export default defineComponent({
  name: 'viewer-view',
  setup(){
    return useLocalSchema()
  }
})
</script>

<template>
  <xform-viewer :schema="schema" class="example-viewer">
    <template #header>
      <h3 class="example-builder-title">笔记本电脑报修单</h3>
    </template>
    <xform-item name="address" title="地址" virtual>
      <template #default="{field}">
        <span class="xform-viewer-value">{{ field.value ?? schema.viewerPlaceholder }}</span>
      </template>
    </xform-item>
  </xform-viewer>
</template>

<style>
.example-viewer{
  padding: 15px 0;
}
</style>
