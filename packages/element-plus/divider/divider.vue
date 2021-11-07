<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import divider from '../../common/components/divider.vue'

export default defineComponent({
  name: 'xform-el-divider',
  inheritAttrs: false,
  props: {
    field: {
      type: FormField,
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
    class="xform-item xform-el-divider" 
    :title="field.title" 
    :layout="field.attributes.layout" 
    :type="field.attributes.type" 
    :top="field.attributes.top" 
    :bottom="field.attributes.bottom"
  />
</template>