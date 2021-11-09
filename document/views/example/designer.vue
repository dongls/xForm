<script lang="tsx">
import { defineComponent, ref } from 'vue'
import { FormField, LogicRule, getOperator, useConstant, FormDesignerApi } from '@dongls/xform'
import { useLocalSchema, useIsWide, toFalse } from '@document/util/common'
import { useTarget, useDesignerToolSlot, useConfirm, useNotify } from './preset'

const { BuiltInLogicOperator } = useConstant()

function fmtOperatorText(operator: string){
  const o = getOperator(operator)
  return o == null ? 'N/A' : o.description ?? o.label
}

function createSchemaErrorContent(arr: any[]): any{
  if(!Array.isArray(arr) || arr.length == 0) return null
  return arr.map(item => {
    const sub = createSchemaErrorContent(item.fields)

    return (
      <div class="example-schema-error">
        <p>第<strong>{item.index + 1}</strong>个字段{item.title ? <strong>[{item.title}]</strong> : null}存在以下错误：</p>
        { item.message ? <p class="example-schema-error-message">- {item.message}</p> : null }
        {sub}
      </div>
    )
  })
}

export default defineComponent({
  name: 'designer-view',
  emits: ['view'],
  setup(props, { emit }){
    const { schema, resetSchema } = useLocalSchema(false)    
    const target = useTarget()
    const isWide = useIsWide()
    const designer = ref<FormDesignerApi>(null)
    const confirm = useConfirm(target)
    const notify = useNotify(target)
    const toolSlot = useDesignerToolSlot(target, {
      isWide,
      validateSchema,
      reset,
      clear,
      viewJson
    })

    function chooseField(field: FormField){
      designer.value.chooseField(field)
    }
  
    function fmtRule(rule: LogicRule & { label: string }){
      return (
        <div class="example-logic-message">
          <span>如果</span>
          <strong>{rule.label}</strong>
          <span>的值</span>
          <strong>{fmtOperatorText(rule.operator)}</strong>
          {rule.operator == BuiltInLogicOperator.EMPTY ? null : <strong>{rule.value ?? 'N/A'}</strong>}
        </div>
      )
    }

    async function onRemove(e: { field: FormField, useDefault: Function }){
      const r = await confirm(e.field).catch(toFalse)
      if(r === true) e.useDefault()
    }

    function showMessage(event: any){
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
        case 'logic.validate': {
          event.preventDefault()
          notify({
            title: event.title,
            content: event.content,
            type: 'error',
            delay: 0
          })
          break
        }
      }
    }

    function validateSchema(){
      return schema.value.validate().then(r => {
        if(r.valid) return notify({
          type: 'success',
          title: '验证通过',
          message: '已通过完备性验证'
        })

        notify({
          type: 'error',
          delay: 0,
          title: '验证失败',
          content: <div>{createSchemaErrorContent(r.result)}</div>
        })
      })
    }

    function reset(){
      resetSchema()
      designer.value.resetSelectedField()
    }
    
    function clear(){
      schema.value.clear()
      designer.value.resetSelectedField()
    }

    function viewJson(){
      emit('view', { title: 'Schema JSON', json: JSON.stringify(schema.value, null, '  ') })
    }

    return function(){
      return (
        <xform-designer
          v-slots={{ tool: toolSlot }}
          ref={designer}
          schema={schema.value}
          mode="example"
          onRemove={onRemove}
          onMessage={showMessage}
        />
      )
    }
  }
})
</script>

<style lang="scss">
$--xform-color-primary: #409EFF !default;

.example-designer-tool{
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

.example-designer-tool-left{
  display: flex;
  flex-flow: row nowrap;
}

.is-wide .xform-is-pc{
  width: auto;
  max-width: none;
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

.example-schema-error{
  padding-left: 10px;

  p{
    margin-bottom: 0;
  }

  & + .example-schema-error{
    margin-top: 4px;
  }

  .example-schema-error-message{
    padding-left: 10px;
  }
}
</style>