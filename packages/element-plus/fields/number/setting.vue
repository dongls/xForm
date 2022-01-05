<template>
  <field-setting :field="field">
    <section :class="['xform-el-field-setting-prop', classes.propDefaultValue]">
      <header>
        <span>默认值：</span>
        <el-button @click="clearDefaultValue" type="primary" link>清除</el-button>
      </header>
      <el-input-number
        :model-value="compatValue"
        :key="version"
        placeholder="[可选] 如果字段没有填写，默认为设定的值"
        controls-position="right"
        @update:model-value="updateValue"
      />
    </section>
    <template #attributes>
      <el-checkbox title="勾选则只允许输入整数" v-model="integer">整数</el-checkbox>
    </template>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { FormField, isEmpty, useConstant } from '@dongls/xform'
import { useDefaultValueApi, useFieldProp } from '@element-plus/util'

import FieldSetting from '@element-plus/FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-el-number-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(props){
    const dvApi = useDefaultValueApi()
    const version = ref(1)
    const integer = useFieldProp('integer', 'attributes')
    const compatValue = dvApi.useCompatValue(function(o: any){
      const value = o.value
      if(typeof value == 'number') return value
      if(isEmpty(value)) return NaN
      return Number(value)
    })

    watch(integer, v => {
      if(!v) return

      const value = compatValue.value as number
      if(isNaN(value)) return

      compatValue.value = Math.round(value)
    })

    function updateValue(v: any){
      const isInteger = props.field.attributes.integer === true
      if(!isInteger) return compatValue.value = v
      
      compatValue.value = Math.round(v)
      version.value++
    }

    return { 
      integer,
      compatValue,
      version,
      updateValue,
      clearDefaultValue(){
        compatValue.value = null
        version.value++
      }
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>

<style lang="scss" module="classes">
.propDefaultValue{
  user-select: none;

  header{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    :global(.el-button){
      padding: 0;
      min-height: 0;
    }
  }

  :global{
    .el-input-number{
      width: 100%;

      .el-input__inner{
        text-align: left;
      }
    }
  }
}
</style>