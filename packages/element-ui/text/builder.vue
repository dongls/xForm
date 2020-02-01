<template>
  <el-input 
    v-xform:validate="field.name"
    :name="field.name" :placeholder="prettyPlaceholder" 
    :value="value" @input="input" 
    clearable
  />
</template>

<script>
import {mixin} from '@dongls/xform';

export default {
  name: 'xform-el-text',
  mixins: [mixin.builder],
  props: {
    value: {
      type: String,
      default: null
    }
  }
}
</script>