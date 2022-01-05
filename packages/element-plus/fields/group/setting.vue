<template>
  <field-setting :field="field" :placeholder="false" :required="false">
    <template #attributes>
      <el-checkbox 
        :name="`${field.name}-collapsable`" 
        v-model="collapsable"
        title="勾选则支持展开/收起分组"
      >允许收起</el-checkbox>
    </template>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useFieldProp } from '@element-plus/util'

import FieldSetting from '@element-plus/FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-el-group-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    return { 
      collapsable: useFieldProp('collapsable', 'attributes')
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>