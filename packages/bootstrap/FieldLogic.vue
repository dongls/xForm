<template>
  <section class="xform-bs-field-setting-prop">
    <header>
      <span title="如果满足配置的条件则显示字段，否则隐藏字段">逻辑：</span>
      <button type="button" class="btn btn-link is-logic-btn" @click="showModal">配置</button>
    </header>
    <logic-rule-preview :rule="field.logic" :field="field"/>
    <modal title="配置逻辑" width="740px" class="xform-bs-logic-modal" v-model:visible="visible" @confirm="save">
      <logic-rule :rule="logic" :field="field" @select="select" @remove="remove" :selected="selected"/>
      <template #footer-left>
        <div class="dropdown xform-bs-logic-dropdown">
          <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" :disabled="disabled">添加规则 </button>
          <div class="dropdown-menu" @click="add">
            <button 
              v-for="operator in comboOperator" :key="operator.value" 
              type="button" class="dropdown-item" :data-operator="operator.value"
            >
              <span>{{ operator.text }}</span>
              <strong>{{ operator.code }}</strong>
            </button>
            <div class="dropdown-divider"/>
            <button 
              v-for="operator in singleOperator" :key="operator.value" 
              type="button" class="dropdown-item" :data-operator="operator.value"
            >
              <span>{{ operator.text }}</span>
              <strong>{{ operator.code }}</strong>
            </button>
          </div>
        </div>
      </template>
    </modal>
  </section>
</template>

<script lang="tsx">
import { computed, defineComponent, PropType, ref } from 'vue'
import { 
  FormDesignerContext,
  FormField,
  LogicRule,
  checkCondition,
  constant,
  getOperator,
  useRenderContext,
} from '@dongls/xform'
import Modal from './Modal.vue'

const { LogicOperator } = constant

const comboOperator = [
  LogicOperator.AND,
  LogicOperator.OR,
  LogicOperator.NOT
]
const singleOperator = [
  LogicOperator.LT,
  LogicOperator.LTE,
  LogicOperator.GT,
  LogicOperator.GTE,
  LogicOperator.EQ,
  LogicOperator.NE,
  LogicOperator.EMPTY,
  LogicOperator.CONTAINS
]

const allow = [
  'text',
  'textarea',
  'number',
  'select',
  'radio',
  'date'
]

function getAllowField(field: FormField){
  return field.previous().filter(f => allow.indexOf(f.type) >= 0)
}

function fmtOperatorText(operator: string){
  const o = getOperator(operator)
  return o == null ? 'N/A' : o.description ?? o.text
}

function createDescription(operator: string){
  if(checkCondition(operator)) return <header>如果<strong>{fmtOperatorText(operator)}</strong>条件被满足：</header>
  return null
}

function handleFieldChange(rule: LogicRule, event: Event){
  const target = event.target as HTMLSelectElement
  const option = target.options[target.selectedIndex]

  rule.name = option.value == '' ? null : option.value
}

function handleOperatorChange(rule: LogicRule, event: Event){
  const target = event.target as HTMLSelectElement
  const option = target.options[target.selectedIndex]

  rule.operator = option.value
  if(option.value == LogicOperator.EMPTY.value) delete rule.value
}

function createContent(rule: LogicRule, field: FormField){
  if(checkCondition(rule.operator)) return null

  const value = (
    rule.operator == LogicOperator.EMPTY.value
      ? null
      : <input type="text" class="form-control" placeholder="请输入目标值" v-model={rule.value}/>
  )

  const fields = (
    <select class="form-control" value={rule.name} onChange={handleFieldChange.bind(null, rule)}>
      <option value="">请选择字段</option>
      {getAllowField(field).map(f => <option value={f.name}>{f.title}</option>)}
    </select>
  )
  const operator = (
    <select class="form-control" value={rule.operator} onChange={handleOperatorChange.bind(null, rule)}>
      {singleOperator.map(o => <option value={o.value}>{o.text}</option>)}
    </select>
  )
  return (
    <div class="xform-bs-logic-rule-content">
      <span>如果字段</span>{fields}<span>的值</span>{operator}{value}    
    </div>
  )
}

function findParent(v: LogicRule, target: LogicRule): LogicRule{
  if(!Array.isArray(v.condition) || v.condition.length == 0) return null

  for(const c of v.condition){
    if(c == target) return v

    const t = findParent(c, target)
    if(null != t) return t
  }

  return null
}

function createRule(operator: string): LogicRule{
  return checkCondition(operator) ? { operator, condition: [] } : { operator, name: null, value: null }
}

const Preivew = defineComponent({
  name: 'logic-rule-preview',
  props: {
    rule: {
      type: Object as any as PropType<LogicRule>,
      default: null
    },
    field: {
      type: FormField,
      required: true
    }
  },
  emits: ['choose'],
  setup(props){
    const rc = useRenderContext<FormDesignerContext>()
    function choose(field: FormField, event: Event){
      event.stopPropagation()
      if(field != null) rc.chooseField(field)
    }

    function createPreivew(rule: LogicRule){
      if(checkCondition(rule.operator)) return null

      const target = props.field.parent?.find(rule.name)
      const name = (
        target != null
          ? <a href="javascript:;" onClick={choose.bind(null, target)}>{target.title}</a>
          : <strong>N/A</strong> 
      )
      return (
        <div class="xform-bs-logic-preview-content">
          <span>如果字段</span>
          {name}
          <span>的值</span>
          <strong>{fmtOperatorText(rule.operator)}</strong>
          {rule.operator == LogicOperator.EMPTY.value ? null : <strong>{rule.value ?? 'N/A'}</strong>}
        </div>
      )
    }

    return function(){
      const rule = props.rule
      if(rule == null){
        return <span class="xform-bs-logic-rule-preview text-secondary">请先添加一条规则</span>
      }

      const hasCondition = checkCondition(rule.operator)
      const klass = {
        'xform-bs-logic-rule-preview': true,
        'has-condition': hasCondition
      }
      const condition = (
        hasCondition
          ? Array.isArray(rule.condition) && rule.condition.length > 0 
            ? rule.condition.map(r => <logic-rule-preview rule={r} field={props.field}/>)
            : <div class="xform-bs-logic-rule-preview text-secondary">请先添加一条规则</div>
          : null
      )

      return (
        <div class={klass}>
          {createDescription(rule.operator)}
          {createPreivew(rule)}
          {condition}
        </div>
      )
    }
  }
})

const Rule = defineComponent({
  name: 'logic-rule',
  props: {
    rule: {
      type: Object as any as PropType<LogicRule>,
      default: null
    },
    selected: {
      type: Object as any as PropType<LogicRule>,
      default: null
    },
    first: {
      type: String,
      default: null
    },
    last: {
      type: String,
      default: null
    },
    parent: {
      type: Object as any as PropType<LogicRule>,
      default: null
    },
    field: {
      type: FormField,
      required: true
    }
  },
  emits: ['select', 'remove'],
  setup(props, { emit }){
    function onSelect(e: any){
      emit('select', e)
    }

    function onRemove(e: any){
      emit('remove', e)
    }

    function select(event: Event){
      event.stopPropagation()
      onSelect(props.rule)
    }

    function remove(event: Event){
      event.stopPropagation()
      onRemove(props.rule)
    }

    function up(event: Event){
      event.stopPropagation()

      const parent = props.parent
      if(null == parent) return

      const rule = props.rule
      const condition = parent.condition
      const index = condition.indexOf(rule)
      const item = condition.splice(index, 1)[0]
      condition.splice(index - 1, 0, item)
    }

    function down(event: Event){
      event.stopPropagation()

      const parent = props.parent
      if(null == parent) return

      const rule = props.rule
      const condition = parent.condition
      const index = condition.indexOf(rule)
      const item = condition.splice(index + 1, 1)[0]
      condition.splice(index, 0, item)
    }

    function createButtions(isSelected: boolean){
      if(!isSelected) return null

      return (
        <div class="xform-bs-logic-rule-buttons">
          {props.first === 'N' && <a href="javascript:;" onClick={up} class="text-primary">上移</a>}
          {props.last === 'N' && <a href="javascript:;" onClick={down} class="text-primary">下移</a>}
          <a href="javascript:;" onClick={remove} class="text-danger">删除</a>
        </div>
      )
    }

    return function(){
      const rule = props.rule
      if(rule == null){
        return <span class="text-secondary">请点击下方按钮添加一条规则</span>
      }

      const isSelected = props.selected == props.rule
      const hasCondition = checkCondition(rule.operator) 
      const klass = {
        'xform-bs-logic-rule': true,
        'has-condition': hasCondition,
        'is-selected': isSelected,
      }

      const condition = (
        hasCondition
          ? Array.isArray(rule.condition) && rule.condition.length > 0 
            ? rule.condition.map((r, index) => {
              return (
                <logic-rule 
                  rule={r}
                  field={props.field}
                  selected={props.selected} 
                  onSelect={onSelect} 
                  onRemove={onRemove}
                  first={index == 0 ? 'Y' : 'N'}
                  last={index == rule.condition.length - 1 ? 'Y' : 'N'}
                  parent={rule}
                />
              )
            }) 
            : <span class="text-secondary">请点击下方按钮添加一条规则</span>
          : null
      )

      const description = createDescription(rule.operator)
      const content = createContent(rule, props.field)

      return (
        <div class={klass} onClick={select}>
          {description}
          {content}
          {createButtions(isSelected)}
          {condition}
        </div>
      )
    }
  }
})

export default defineComponent({
  name: 'field-logic',
  props: {
    field: {
      type: FormField,
      required: true
    },
  },
  setup(props) {
    const rc = useRenderContext<FormDesignerContext>()
    const visible = ref(false)
    const logic = ref<LogicRule>(null)
    const selected = ref<LogicRule>(null)

    function showModal(){
      const clone = JSON.parse(JSON.stringify(props.field.logic ?? null))
      logic.value = clone
      selected.value = clone
      visible.value = true
    }

    function save(){
      // TODO: 验证
      rc.updateField(props.field, { prop: 'logic', value: logic.value })
      visible.value = false
    }

    function add(event: Event){
      const target = (event.target as Element).closest('button.dropdown-item')
      if(null == target) return

      const operator = (target as HTMLElement).dataset.operator
      const rule = createRule(operator)
      if(logic.value == null) {
        logic.value = rule
        selected.value = rule
        return 
      }

      checkCondition(selected.value.operator) ? selected.value.condition.push(rule) : selected.value = rule
    }

    function select(event: any){
      selected.value = event
    }

    function remove(){
      const target = selected.value

      if(logic.value == target){
        logic.value = null
      } else {
        const parent = findParent(logic.value, target)
        const index = parent.condition.indexOf(target)
        if(index >= 0) parent.condition.splice(index, 1)
      }

      selected.value = null
    }

    return {
      LogicOperator,
      add,
      disabled: computed(() => (selected.value == null && logic.value != null) || (selected.value != null && !checkCondition(selected.value.operator))),
      logic,
      remove,
      save,
      select,
      selected,
      showModal,
      visible,
      comboOperator,
      singleOperator
    }
  },
  components: {
    [Modal.name]: Modal,
    [Rule.name]: Rule,
    [Preivew.name]: Preivew
  }
})
</script>


<style lang="scss">
.is-logic-btn{
  padding: 0;
  box-shadow: none !important;
  font-size: 14px;
  line-height: 20px;
  border: none;
  float: right;
}

.xform-bs-logic-modal{
  .modal-body{
    max-height: calc(100vh - 200px);
    overflow: auto;
    padding: 20px;
    min-height: 240px;
  }
}

.xform-bs-logic-dropdown{
  .dropdown-menu{
    padding: 0.25rem 0;
  }

  .dropdown-item{
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.45;

    strong{
      float: right;
      color: #9aa5af;
    }
  }
}

.xform-bs-logic-rule{
  padding: 8px 10px;
  border: 1px dashed #ccc;
  position: relative;

  &.has-condition{
    padding: 20px;
  }

  & > header{
    position: absolute;
    left: 12px;
    top: -10px;
    z-index: 2;
    background-color: #fff;
    padding-left: 8px;
    line-height: 20px;
    
    strong{
      margin: 0 4px;
    }
  }

  & + .xform-bs-logic-rule{
    margin-top: 15px;
  }

  &.is-selected{
    border-color: #007bff;
    border-style: solid;
  }

  & > .xform-bs-logic-rule::after{
    content: "";
    position: absolute;
    width: 20px;
    left: -20px;
    top: 50%;
    border-bottom: 1px dashed #ccc;
  }
}

.xform-bs-logic-rule-content{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .form-control{
    width: 120px;
    margin: 0 5px;
    padding: 1px 4px;
    height: calc(1.5em + 4px);
    font-size: 0.875rem;
    border-radius: 0.125rem;
    font-weight: 700;
  }

  strong{
    margin: 0 4px;

    & + strong{
      margin-left: 0;
    }
  }

  .xform-bs-logic-rule-operator{
    width: 60px;
  }
}

.xform-bs-logic-rule-buttons{
  position: absolute;
  right: 10px;
  top: -10px;
  background-color: #fff !important;

  a{
    padding: 0 6px;
    margin: 0;
    font-size: 0.875rem;
    border: none  !important;
    height: 20px;
    line-height: 20px;
    background-color: transparent !important;

    &:hover{
      text-decoration: underline !important;
    }
  }
}

.xform-bs-logic-rule-preview{
  position: relative;
  line-height: 24px;

  strong, a{
    margin: 0 4px;
  }

  & > .xform-bs-logic-rule-preview{
    margin-left: 20px;
    padding-left: 5px;

    &::before{
      content: "";
        position: absolute;
        left: -10px;
        top: 0;
        bottom: 0;
        border-left: 1px solid #6c757d;
    }

    &::after{
      content: "";
      position: absolute;
      width: 10px;
      left: -10px;
      top: 12px;
      border-bottom: 1px solid #6c757d;
    }

    &:last-child::before{
      bottom: 12px;
    }
  }
}
</style>