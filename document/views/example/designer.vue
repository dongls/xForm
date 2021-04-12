<script lang="tsx">
import { FormField, LogicRule, constant, getOperator } from '@dongls/xform'
import { useLocalSchema, useIsWide } from '@document/util/common'
import { defineComponent, ref } from 'vue'
import { useNotification } from '@document/component'

const { LogicOperator } = constant
let timer: any = null

function fmtOperatorText(operator: string){
  const o = getOperator(operator)
  return o == null ? 'N/A' : o.description ?? o.text
}

export default defineComponent({
  name: 'designer-view',
  emits: ['view'],
  setup(){
    const { schema, resetSchema } = useLocalSchema(false)    
    const { notify } = useNotification()
    const isSchemaValid = ref(false)
    const designer = ref(null)

    function chooseField(field: FormField){
      designer.value.chooseField(field)
    }

    function fmtRule(rule: LogicRule & { label: string }){
      return (
        <div class="example-logic-message">
          <span>如果字段</span>
          <strong>{rule.label}</strong>
          <span>的值</span>
          <strong>{fmtOperatorText(rule.operator)}</strong>
          {rule.operator == LogicOperator.EMPTY.value ? null : <strong>{rule.value ?? 'N/A'}</strong>}
        </div>
      )
    }

    return {
      designer,
      showMessage(event: any){
        switch(event.type){
          case 'logic.change': {
            const field = event.field as FormField
            const data = event.data as any[]
            const anchor = <a href="javascript:;" onClick={chooseField.bind(null, field)}>{field.title}</a>
            const content = (
              <div class="example-logic-tip">
                <p>字段{anchor}的逻辑发生变更，以下条件被<strong>删除</strong>：</p>
                {data.map(fmtRule)}
              </div>
            )
        
            notify({ title: event.title, content, delay: 0 })
            break
          }
        }
      },
      isSchemaValid,
      isWide: useIsWide(),
      schema,
      reset(){
        resetSchema()
        this.$refs.designer.resetSelectedField()
      },
      clear(){
        schema.value.clear()
        this.$refs.designer.resetSelectedField()
      },
      viewJson(){
        this.$emit('view', { title: 'Schema JSON', json: JSON.stringify(schema.value, null, '  ') })
      },
      remove(e: { field: FormField, defaultAction: Function }){
        window.confirm(`确定要删除字段[${e.field.title}]?`) && e.defaultAction()
      },
      validateSchema(){
        return schema.value.validate().then(r => {
          if(!r.valid){
            return this.$emit('view', { title: '错误信息', json: JSON.stringify(r.result, null, '  ') })
          }

          isSchemaValid.value = true
          if(timer) clearTimeout(timer)

          timer = setTimeout(() => {
            isSchemaValid.value = false
            timer = null
          }, 2000)
        })
      }
    }
  }
})
</script>

<template>
  <xform-designer ref="designer" v-model:schema="schema" mode="example" @remove="remove" @message="showMessage">
    <template #tool>
      <div class="designer-tool">
        <div class="designer-tool-left">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="prop-is-wide" v-model="isWide">
            <label class="custom-control-label" for="prop-is-wide">宽屏</label>
          </div>
        </div>
        <div class="designer-tool-right">
          <strong class="is-schema-valid" v-if="isSchemaValid">验证通过</strong>
          <button type="button" class="btn btn-link btn-text btn-sm" @click="validateSchema">验证</button>
          <button type="button" class="btn btn-link btn-text btn-sm" @click="reset">重置</button>
          <button type="button" class="btn btn-link btn-text btn-sm" @click="clear">清空</button>
          <button type="button" class="btn btn-link btn-text btn-sm" @click="viewJson">查看JSON</button>
        </div>
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

  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.designer-tool-left .custom-checkbox{
  height: 24px;
  line-height: 24px;
}

.is-wide .xform-is-pc{
  width: auto;
  max-width: none;
}

.is-schema-valid{
  color: #28a745;
  margin-right: 5px;
}

.example-logic-tip{
  a{
    font-weight: 700;
    margin: 0 2px;
  }

  p{
    font-size: 14px;
    margin: 0;

    strong{
      color: #dc3545;
      margin: 0 2px;
    }
  }
}

.example-logic-message{
  position: relative;
  line-height: 20px;
  padding: 0 0 0 20px;
  margin-top: 5px;

  strong{
    margin: 0 2px;
  }

  &::before{
    content: "-";
    position: absolute;
    left: 0;
    top: 0;
    line-height: 20px;
    width: 20px;
    text-align: center;
  }
}
</style>