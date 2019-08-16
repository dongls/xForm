<template>
  <el-input
    type="textarea"
    v-xform:validate="field.name"
    :name="field.name" :placeholder="prettyPlaceholder"
    :value="value" @input="input" 
    :autosize="{minRows: 3, maxRows: 10}"
  />
</template>

<script>
import {mixin} from '@src/index';

export default {
  name: 'xform-el-textarea',
  mixins: [mixin.builder],
  props: {
    value: {
      type: String,
      default: null
    }
  }
}
</script>