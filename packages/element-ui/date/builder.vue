<template>
  <el-date-picker
    class="xform-el-date" :type="type"
    v-xform:validate="field.name"
    :name="field.name" :placeholder="prettyPlaceholder"
    :value="fmtValue" @input="input" 
    :value-format="formatter"
    default-time="08:00:00"
    clearable
  />
</template>

<script>
import {mixin} from '@dongls/xform';

export default {
  name: 'xform-el-date',
  mixins: [mixin.builder],
  props: {
    value: {
      type: String,
      default: null
    }
  },
  computed: {
    formatter(){
      return this.type == 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
    },
    type(){
      return this.field.attributes.type || 'date'
    },
    fmtValue(){
      let value = this.value;
      if(this.type == 'datetime' && null != value && value.length == '10') value += ' 00:00:00';

      return value;
    }
  }
}
</script>