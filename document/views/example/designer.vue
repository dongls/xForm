<script lang="ts">
import { XField } from '@core/index'
import { useLocalSchema } from '@document/util/common'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'designer-view',
  emits: ['view'],
  setup(){
    const { schema, schemaJSON, reset } = useLocalSchema()    
    return {
      schema,
      schemaJSON,
      reset,
      viewJson(){
        this.$emit('view', { title: 'Field JSON', json: schemaJSON })
      },
      remove(e: { field: XField, defaultAction: Function }){
        window.confirm(`确定要删除字段[${e.field.title}]?`) && e.defaultAction()
      }
    }
  }
})
</script>

<template>
  <xform-designer v-model:schema="schema" mode="example" @remove="remove">
    <template #tool>
      <div class="designer-tool">
        <button type="button" class="btn btn-link btn-text btn-sm" @click="reset">清空</button>
        <button type="button" class="btn btn-link btn-text btn-sm" @click="viewJson">查看JSON</button>
      </div>
    </template>

    <!--     
    <template #preview_type_text="scope">
      <div>field preview for type : {{ scope.field.type }}</div>
    </template>
    <template #preview_name_field_ee39cd="scope">
      <div>field preview for name: {{ scope.field.name }}</div>
    </template> 
    -->

    <!--
    <template #setting_form="scope">
      <div>test setting: {{ scope.schema }}</div>
    </template>
    -->

    <!-- 
    <template #setting_name_field_8e78d692="{field}">
      <div>field setting for name: {{ field }}</div>
    </template> 
    <template #setting_type_text="scope">
      <div>field setting for type: {{ scope }}</div>
    </template> 
    -->
  </xform-designer>
</template>

<style lang="scss">
$--xform-color-primary: #409EFF !default;

.designer-tool{
  text-align: right;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
  line-height: 38px;
  height: 38px;
}
</style>