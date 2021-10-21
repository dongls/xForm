<template>
  <field-setting :field="field" :placeholder="false">
    <section class="xform-bs-field-setting-prop">
      <header>表单布局：</header>
      <div class="btn-group" role="group">
        <button
          type="button" 
          :class="['btn', 'btn-sm', 'btn-primary', field.attributes.layout == 'modal' ? 'active' : null]"
          @click="update('layout', 'modal', 'attributes')"
          title="选中则表单在弹出模态框中编辑"
        >窗口</button>
        <button 
          type="button" 
          :class="['btn', 'btn-sm', 'btn-primary', field.attributes.layout == 'inline' ? 'active' : null]"
          @click="update('layout', 'inline', 'attributes')"
          title="选中则表单在表格中直接编辑"
        >行内</button>
      </div>
    </section>
    <section class="xform-bs-field-setting-prop">
      <header>列宽：</header>
      <div class="xform-bs-subform-column" v-for="column in field.fields" :key="column.uid">
        <div class="xform-bs-subform-column-bar" :style="{ width: `${getColumnWidth(column.name) ?? DEF_COLUMN_WIDTH}px` }"/>
        <label>{{ column.title }}</label>
        <input 
          type="number" min="0"
          :placeholder="`默认宽度${DEF_COLUMN_WIDTH}`"
          class="form-control form-control-sm"
          :value="getColumnWidth(column.name)"
          @input="updateColWidth($event, column.name)"
        >
      </div>
      <div class="text-secondary" v-if="field.fields.length == 0">请至少放入一个字段</div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { DEF_COLUMN_WIDTH } from './common'
import FieldSetting from '../FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-bs-subform-setting',
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

    function update(prop: string, value: string, scope?: string){
      emit(EVENTS.UPDATE_FIELD, { value, prop, scope })
    }

    function getColumnWidth(name: string){
      return props.field.attributes.colWidths[name]
    }

    return { updateColWidth, update, DEF_COLUMN_WIDTH, getColumnWidth }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>

<style lang="scss">
.xform-bs-subform-column{
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

    &::-webkit-inner-spin-button{
      -webkit-appearance: none !important;
    }
  }

  & + .xform-bs-subform-column{
    margin-top: 5px;
  }
}

.xform-bs-subform-column-bar{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #f3f6f8;
  z-index: 1;
  border-right: 1px solid #ced4da;
}
</style>