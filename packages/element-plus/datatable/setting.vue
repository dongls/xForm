<template>
  <field-setting :field="field" :placeholder="false">
    <template #title>
      <el-checkbox title="勾选则不显示标题" v-model="hideTitle">隐藏标题</el-checkbox>
      <el-checkbox title="勾选则标题位于顶部" v-model="labelPosition">顶部对齐</el-checkbox>
    </template>
    <section class="xform-el-field-setting-prop">
      <header>表单布局：</header>
      <el-radio-group v-model="layout" size="small">
        <el-radio-button label="modal" title="选中则表单在弹出模态框中编辑">窗口</el-radio-button>
        <el-radio-button label="inline" title="选中则表单在表格中直接编辑">行内</el-radio-button>
      </el-radio-group>
    </section>
    <section class="xform-el-field-setting-prop">
      <header>列宽：</header>
      <div class="xform-el-datatable-column" v-for="column in field.fields" :key="column.uid">
        <div class="xform-el-datatable-column-width" :style="{ width: `${getColumnWidth(column.name) ?? DEF_COLUMN_WIDTH}px` }"/>
        <label>{{ column.title }}</label>
        <input 
          type="number" min="0"
          :placeholder="`默认宽度${DEF_COLUMN_WIDTH}`"
          :value="getColumnWidth(column.name)"
          @input="updateColWidth($event, column.name)"
        >
      </div>
      <div class="text-secondary" v-if="field.fields.length == 0">请至少放入一个字段</div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { DEF_COLUMN_WIDTH } from './common'
import { useFieldProp } from '@common/util'
import FieldSetting from '../FieldSetting.vue'

const { EVENTS, LabelPosition } = useConstant()

export default defineComponent({
  name: 'xform-el-datatable-setting',
  props: {
    field: {
      type: FormField,
      required: true
    }
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(props, { emit }){
    function updateColWidth(event: Event, key: string){
      const target = event.target as HTMLInputElement
      const value = parseFloat(target.value)
      const colWidths = props.field.attributes.colWidths
      colWidths[key] = isNaN(value) ? null : value
      emit(EVENTS.UPDATE_FIELD, { prop: 'colWidths', value: colWidths, scope: 'attributes' })
    }

    function getColumnWidth(name: string){
      return props.field.attributes.colWidths[name]
    }

    return { 
      DEF_COLUMN_WIDTH,
      updateColWidth, 
      getColumnWidth,
      layout: useFieldProp('layout', 'attributes'),
      hideTitle: useFieldProp('hideTitle', 'attributes'),
      labelPosition: computed({
        get(){
          return props.field.attributes?.labelPosition == LabelPosition.TOP
        },
        set(v: any){
          const value = v === true ? LabelPosition.TOP : undefined
          emit(EVENTS.UPDATE_FIELD, { prop: 'labelPosition', scope: 'attributes', value })
        }
      })
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>

<style lang="scss">
.xform-el-datatable-column{
  position: relative;
  border: 1px solid #ced4da;
  line-height: 30px;
  overflow: hidden;
  border-radius: 3px;

  &::after{
    content: "px";
    font-weight: 700;
    position: absolute;
    right: 0px;
    top: 0;
    width: 20px;
    text-align: center;
    z-index: 2;
  }

  label{
    font-weight: 700;
    margin: 0;
    padding-left: 10px;
    position: relative;
    z-index: 2;
  }

  input{
    position: absolute;
    right: 20px;
    top: 2px;
    border: none;
    width: 90px;
    z-index: 2;
    height: 26px;
    line-height: 20px;
    padding: 3px 5px;
    background-color: #e9ecef !important;
    appearance: textfield;
    box-shadow: none !important;
    outline: none;
    border-radius: 3px;

    &::-webkit-inner-spin-button{
      -webkit-appearance: none !important;
    }
  }

  & + .xform-el-datatable-column{
    margin-top: 5px;
  }
}

.xform-el-datatable-column-width{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #f3f6f8;
  z-index: 1;
  border-right: 1px solid #ced4da;
}
</style>