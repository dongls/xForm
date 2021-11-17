<template>
  <field-setting :field="field" :placeholder="false">
    <section class="xform-bs-field-setting-prop">
      <header>布局：</header>
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" :class="{'active': field.attributes.layout == 'inline'}" @click="update('layout', 'inline', 'attributes')"> 行内 </button>
        <button type="button" class="btn btn-sm btn-primary" :class="{'active': field.attributes.layout == 'block'}" @click="update('layout', 'block', 'attributes')"> 换行 </button>
      </div>
    </section>
    <section class="xform-bs-field-setting-prop">
      <header>选项：</header>
      <div
        v-for="(option, i) in options" :key="i"
        class="xform-bs-setting-option"
      >
        <input :value="option.value" class="form-control form-control-sm" placeholder="请输入选项内容" @input="updateOption($event, option)">
        <button type="button" class="btn btn-link btn-text text-danger" @click="removeOption(option)" :disabled="options.length <= 1">删除</button>
      </div>
      
      <button type="button" class="btn btn-sm btn-link btn-text p-0" @click="addOption">添加选项</button>
    </section>

    <section class="xform-bs-field-setting-prop">
      <header>默认值：</header>
      <div :class="classes.defaultValue">
        <select 
          class="form-select form-select-sm"
          v-model="compatType"
        >
          <option 
            v-for="(type, index) in defTypes" :key="index" 
            :value="type.value"
          >{{ type.label || type.value }}</option>
        </select>
        <select 
          v-if="isManual"
          v-model="compatValue"
          class="form-select form-select-sm"
        >
          <option value>-- 请选择--</option>
          <option 
            v-for="(option, index) in options" :key="index" 
            :value="option.value"
          >{{ option.label || option.value }}</option>
        </select>
      </div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useOptions, useDefaultValueApi } from '../util'

import FieldSetting from '../FieldSetting.vue'

const { BuiltInDefaultValueType, EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-bs-radio-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    const defTypes = [
      { value: BuiltInDefaultValueType.MANUAL, label: '手动指定' },
      { value: BuiltInDefaultValueType.OPTION_FIRST, label: '首选项' },
    ]

    const optionState = useOptions(cleanDefaultValue)
    const dvApi = useDefaultValueApi(defTypes)
    const isManual = dvApi.useIsManual()
    const compatType = dvApi.useCompatType()
    const compatValue = dvApi.useCompatValue(function(raw: any){
      return raw.value || ''
    })

    function cleanDefaultValue(){
      if(!isManual.value) return

      const opts = optionState.options.value
      const value = compatValue.value
      compatValue.value = opts.some(o => o.value == value) ? value : undefined
    }

    return {
      compatType,
      compatValue,
      defTypes,
      isManual,
      ...optionState
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>


<style module="classes">
.defaultValue{
  display: flex;
  flex-flow: row nowrap;
}

.defaultValue select + select{
  margin-left: 5px;
}
</style>