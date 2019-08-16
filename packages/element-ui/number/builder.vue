<template>
  <el-input-number 
    class="xform-el-number"
    v-xform:validate="field.name"
    :value="value" @input="input" 
    controls-position="right" :placeholder="prettyPlaceholder"
  />
</template>

<script>
// TODO: 弃用 InputNumber 组件
import {mixin} from '@src/index';

export default {
  name: 'xform-el-number',
  mixins: [mixin.builder],
  props: {
    value: {
      type: Number,
      default: null
    }
  }
}
</script>