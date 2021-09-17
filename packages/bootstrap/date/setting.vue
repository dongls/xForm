<template>
  <field-setting :field="field" :placeholder="false">
    <section class="xform-bs-field-setting-prop">
      <header>
        <label class="xform-bs-label" title="如果字段没有填写，默认为设定的值">默认值：</label>
      </header>
      <div :class="classes.defaultValue">
        <select
          class="form-control form-control-sm"
          v-model="compatType"
        >
          <option 
            v-for="(type, index) in defTypes" :key="index" 
            :value="type.value"
          >{{ type.label || type.value }}</option>
        </select>
        <input
          v-if="isManual"
          type="date"
          v-model="compatValue"
          class="form-control form-control-sm"
          placeholder="请选择默认时间"
        >
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
  name: 'xform-bs-date-setting',
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
      defTypes
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

  select{
    flex: 1;
  }

  input[type="date"]{
    width: 200px;
    margin-left: 5px;
  }
}
</style>
