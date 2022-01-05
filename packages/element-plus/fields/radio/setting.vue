<template>
  <field-setting :field="field" :placeholder="false">
    <section class="xform-el-field-setting-prop">
      <header>布局：</header>
      <el-radio-group v-model="layout">
        <el-radio-button label="inline">行内</el-radio-button>
        <el-radio-button label="block">换行</el-radio-button>
      </el-radio-group>
    </section>
    <section class="xform-el-field-setting-prop">
      <header>选项：</header>
      <div 
        v-for="(option, i) in options" :key="i"
        class="xform-el-setting-option"
      >
        <el-input v-model="option.value" placeholder="请输入选项内容"/>
        <el-button 
          type="danger" link 
          @click="removeOption(option)" 
          :disabled="field.options.length <= 1"
        >删除</el-button>
      </div>
      <el-button type="primary" @click="addOption" link>添加选项</el-button>
    </section>

    <section class="xform-el-field-setting-prop">
      <header>默认值：</header>
      <div :class="classes.defaultValue">
        <el-select v-model="compatType" :class="classes.compatType">
          <el-option 
            v-for="(type, index) in defTypes" :key="index" 
            :value="type.value"
            :label="type.label || type.value"
          />
        </el-select>
        <el-select
          v-if="isManual"
          v-model="compatValue"
          :class="classes.compatValue"
          placeholder="请选择"
          clearable
        >
          <el-option 
            v-for="(option, index) in options" :key="index" 
            :value="option.value"
            :label="option.label || option.value"
          />
        </el-select>
      </div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useOptions, useDefaultValueApi, useFieldProp } from '@element-plus/util'

import FieldSetting from '@element-plus/FieldSetting.vue'

const { BuiltInDefaultValueType, EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-el-radio-setting',
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
      layout: useFieldProp('layout', 'attributes'),
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

.compatType{
  flex: 1;
}

.compatValue{
  margin-left: 5px;
  width: 200px;
}
</style>