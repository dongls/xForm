<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import divider from '../../common/components/divider.vue'

export default defineComponent({
  name: 'xform-bs-divider',
  inheritAttrs: false,
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  components: {
    [divider.name]: divider
  }
})
</script>

<template>
  <xform-divider 
    class="xform-item" 
    :title="field.title" 
    :layout="field.attributes.layout" 
    :type="field.attributes.type" 
    :top="field.attributes.top" 
    :bottom="field.attributes.bottom"
  />
</template>