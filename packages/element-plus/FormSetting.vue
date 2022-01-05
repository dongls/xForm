<script lang="ts">
import { defineComponent } from 'vue'
import { FormSchema, useConstant } from '@dongls/xform'
import { useSchemaProp } from './util'

const { EVENTS, LabelPosition } = useConstant()
const positions = Object.values(LabelPosition)

export default defineComponent({
  name: 'form-setting',
  props: {
    schema: {
      type: FormSchema,
      required: true
    }
  },
  emits: [EVENTS.UPDATE_PROP],
  setup(){
    return {
      LabelPosition,
      labelPosition: useSchemaProp('labelPosition', function(schema){
        const value = schema.labelPosition
        return positions.includes(value) ? value : LabelPosition.LEFT
      }),
      labelSuffix: useSchemaProp('labelSuffix'),
      viewerPlaceholder: useSchemaProp('viewerPlaceholder')
    }
  }
})
</script>

<template>
  <section class="xform-setting">
    <header>标题后缀：</header>
    <el-input v-model="labelSuffix" placeholder="请输入标题后缀..."/>
  </section>
  <section class="xform-setting">
    <header>空值显示为：</header>
    <el-input v-model="viewerPlaceholder" placeholder="查看表单时如果值为空，则显示输入值"/>
  </section>
  <section class="xform-setting">
    <header>标题位置：</header>
    <el-radio-group v-model="labelPosition">
      <el-radio-button :label="LabelPosition.LEFT">左对齐</el-radio-button>
      <el-radio-button :label="LabelPosition.TOP">顶部对齐</el-radio-button>
      <el-radio-button :label="LabelPosition.RIGHT">右对齐</el-radio-button>
    </el-radio-group>
  </section>
</template>