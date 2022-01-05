<script lang="tsx">
import { defineComponent, ref } from 'vue'
import { FormField, FormDesignerApi } from '@dongls/xform'
import { useLocalSchema, useIsWide, toFalse } from '@document/util/common'
import { useTarget, useDesignerToolSlot, useConfirm, useNotify } from './preset'

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
  
    function fmtLogicTip(field: FormField){
      return (
        <div class="example-logic-message">
          <strong onClick={chooseField.bind(null, field)}>{field.title}</strong>
        </div>
      )
    }

    async function onRemove(e: { field: FormField, useDefault: Function }){
      const message = `点击<strong>确定</strong>将<strong danger>删除</strong>字段<strong info>${e.field.title}</strong>!`
      const title = `确定要删除字段[${e.field.title}]?`

      const r = await confirm(message, title).catch(toFalse)
      if(r === true) e.useDefault()
    }

    async function onClear(e: { field: FormField, useDefault: Function }){
      const message = '点击<strong>确定</strong>将<strong danger>删除</strong>所有可删除的子字段!'
      const title = `确定要清空字段[${e.field.title}]?`

      const r = await confirm(message, title).catch(toFalse)
      if(r === true) e.useDefault()
    }

    function showMessage(event: any){
      switch(event.type){
        case 'logic.change': {
          const field = event.target as FormField
          const fields = event.fields as FormField[]
          const prefix = (
            event.action.type == 'field.remove'
              ? <span>字段<strong class="example-logic-target-remove">{field.title}</strong>被删除</span>
              : <span>字段<strong class="example-logic-target-move" onClick={chooseField.bind(null, field)}>{field.title}</strong>位置变化</span>
          )

          const content = (
            <div class="example-logic-tip">
              <p class="example-logic-head">因{prefix}<span>，以下字段受到影响：</span></p>
              {fields.map(fmtLogicTip)}
            </div>
          )
      
          notify({ title: '字段逻辑变更', content, delay: 0 })
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
          onClear={onClear}
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

.is-wide{
  --xform-designer-responsive-width:  100%;
}

.example-logic-head{
  margin: 0;
}

.example-logic-target-remove{
  font-size: 14px;
  font-weight: 700;
  color: var(--xform-color-danger);
  margin: 0 5px;
}

.example-logic-target-move{
  font-size: 14px;
  font-weight: 700;
  color: var(--xform-color-primary);
  margin: 0 4px;
  cursor: pointer;

  &:hover{
    border-bottom: 1px solid currentColor;
  }
}

.example-logic-message{
  position: relative;
  line-height: 20px;
  padding: 0 0 0 20px;
  margin-top: 5px;

  strong{
    font-size: 14px;
    font-weight: 700;
    color: var(--xform-color-primary);
    cursor: pointer;

    &:hover{
      border-bottom: 1px solid currentColor;
    }
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