<template>
  <field-setting :field="field">
    <section class="xform-el-field-setting-prop">
      <header>默认值：</header>
      <div :class="classes.defaultValue">
        <el-select v-model="compatType" size="small">
          <el-option 
            v-for="(type, index) in defTypes" :key="index" 
            :value="type.value" 
            :label="type.label || type.value"
          />
        </el-select>
        <el-date-picker 
          v-if="isManual"
          v-model="compatValue"
          placeholder="请选择默认时间"
          size="small"
          :format="field.attributes.format"
          :value-format="field.attributes.valueFormat"
          :editable="false"
          :popper-options="popperOptions"
        />
      </div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useDefaultValueApi } from '../util'

import FieldSetting from '../FieldSetting.vue'

const { BuiltInDefaultValueType, EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-el-date-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    const defTypes = [
      { value: BuiltInDefaultValueType.MANUAL, label: '手动指定' },
      { value: BuiltInDefaultValueType.DATE_NOW, label: '当前时间' },
    ]

    const dvApi = useDefaultValueApi(defTypes)
    const isManual = dvApi.useIsManual()
    const compatType = dvApi.useCompatType()
    const compatValue = dvApi.useCompatValue()

    return {
      isManual,
      compatType,
      compatValue,
      defTypes,
      popperOptions: {
        placement: 'bottom-end'
      }
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>

<style lang="scss" module="classes">
.defaultValue{
  display: flex;

  :global{
    .el-select{
      flex: 1;
      width: 0;
    }

    .el-date-editor{
      width: 200px;
      margin-left: 5px;
    }
  }
}
</style>
