<template>
  <pre class="xform-textarea-viewer">{{ value }}</pre>
</template>

<script>

export default {
  name: 'xform-el-text-viewer',
  props: {
    field: {
      type: Object,
      default(){
        return {};
      }
    },
    value: {
      type: String,
      default: null
    },
    model: {
      type: Object,
      default(){
        return {};
      }
    }
  }
}
</script>