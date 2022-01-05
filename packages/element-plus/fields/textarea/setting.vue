<template>
  <field-setting :field="field">
    <section class="xform-el-field-setting-prop">
      <header>默认值：</header>
      <el-input v-model="compatValue" placeholder="[可选] 如果字段没有填写，默认为设定的值"/>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useDefaultValueApi } from '@element-plus/util'

import FieldSetting from '@element-plus/FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-el-textarea-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    const dvApi = useDefaultValueApi([])

    return { 
      compatValue: dvApi.useCompatValue()
    }
  },
  components: { 
    [FieldSetting.name]: FieldSetting
  }
})
</script>