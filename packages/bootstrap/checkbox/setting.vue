<template>
  <field-setting :field="field" :placeholder="false">
    <section class="xform-bs-field-setting-prop">
      <header>布局：</header>
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" :class="{'active': field.attributes.layout == 'inline' }" @click="update('layout', 'inline', 'attributes')"> 行内 </button>
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
        <button type="button" class="btn btn-link text-danger" @click="removeOption(option)" :disabled="field.options.length <= 1">删除</button>
      </div>
      <button type="text" class="btn btn-link btn-sm bs-btn-text" @click="addOption">添加选项</button>
    </section>

    <section class="xform-bs-field-setting-prop">
      <header>默认值：</header>
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
        <select 
          v-if="isManual"
          v-model="compatValue"
          class="form-control form-control-sm"
          multiple 
        >
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
import { useDefaultValueApi, useOptions } from '../util'

import FieldSetting from '../FieldSetting.vue'

const { BuiltInDefaultValueType, EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-bs-checkbox-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    const defTypes = [
      { value: BuiltInDefaultValueType.MANUAL, label: '手动指定' },
      { value: BuiltInDefaultValueType.OPTION_ALL, label: '全部选项' },
    ]

    const optionState = useOptions(cleanDefaultValue)
    const dvApi = useDefaultValueApi(defTypes)
    const isManual = dvApi.useIsManual()
    const compatType = dvApi.useCompatType()
    const compatValue = dvApi.useCompatValue(function(raw: any){
      const value = raw.value
      return Array.isArray(value) ? value : []
    })

    function cleanDefaultValue(){
      if(!isManual.value) return

      const opts = optionState.options.value
      const value = compatValue.value as any[]
      compatValue.value = value.filter(v => opts.some(o => o.value == v))
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
.defaultValue select + select{
  margin-top: 5px;
}
</style>