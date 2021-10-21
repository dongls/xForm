<template>
  <section class="xform-bs-field-setting-prop">
    <header>
      <span title="如果满足配置的条件则显示字段，否则隐藏字段">逻辑：</span>
      <button type="button" class="btn btn-link is-logic-btn" @click="showModal">配置</button>
    </header>
    <logic-rule-preview :rule="field.logic" :field="field"/>
    <modal title="配置逻辑" width="840px" class="xform-bs-logic-modal" v-model:visible="visible" @confirm="save">
      <div class="xform-bs-logic-main">
        <div class="xform-bs-logic-panel xform-is-scroll">
          <div class="xform-bs-logic-common-rule">
            <h5>通用规则</h5>
            <div>
              <div 
                v-for="operator in commonOperators" :key="operator.value"
                class="xform-bs-logic-operator" :class="{'xform-is-disabled': disabled}"
              >
                <strong>{{ operator.label }}</strong>
                <small class="text-secondary" v-if="operator.code">{{ operator.code }}</small>
                <button type="button" class="btn btn-link btn-sm" @click="add(operator.value)">添加</button>
              </div>
            </div>
          </div>

          <div class="xform-bs-logic-field-rule">
            <h5>
              <strong>字段规则</strong>
              <button type="button" class="btn btn-link" @click="selectedField = null" v-if="selectedField != null">返回</button>
            </h5>
            <div v-if="selectedField == null">
              <div 
                v-for="f in previousFields" :key="f.name" 
                class="xform-bs-logic-field" 
                :class="{'xform-is-selected': f == selectedField, 'xform-is-disabled': disabled}"
                @click="selectField(f)"
              ><strong>{{ f.title }}</strong></div>
              <div class="xform-bs-logic-field-rule-tip" v-if="previousFields.length == 0">暂无可用的字段规则</div>
            </div>
            <div v-if="fieldOperators.length > 0">
              <div 
                v-for="operator in fieldOperators" :key="operator.value"
                class="xform-bs-logic-operator" :class="{'xform-is-disabled': disabled}"
              >
                <strong>{{ operator.label }}</strong>
                <small class="text-secondary" v-if="operator.code">{{ operator.code }}</small>
                <button type="button" class="btn btn-link btn-sm" @click="add(operator.value)">添加</button>
              </div>
            </div>
          </div>
        </div>
        <div class="xform-bs-logic-graph xform-is-scroll">
          <logic-rule 
            :rule="logic"
            :field="field" 
            :selected="selectedRule"
            @select="selectRule" 
            @remove="remove" 
          />
        </div>

      </div>
      <template #footer-left>
        <div class="bg-danger text-white xform-bs-logic-errors" v-if="showErrorMessage">{{ errorMessage }}</div>
      </template>
    </modal>
  </section>
</template>

<script lang="tsx">
// TODO: 目标值支持读取字段值
import { computed, defineComponent, PropType, ref } from 'vue'
import { 
  FormDesignerContext,
  FormField,
  LogicRule,
  getOperator,
  getOperators,
  useRenderContext,
  useConstant,
} from '@dongls/xform'
import Modal from './Modal.vue'

const { LogicOperator } = useConstant()
const COMMON_OPERATORS = [
  LogicOperator.AND,
  LogicOperator.OR,
  LogicOperator.NOT
]

function checkCondition(operator: string){
  const conf = getOperator(operator)
  return conf != null && conf.hasCondition === true
}

function fmtOperatorText(operator: string){
  const o = getOperator(operator)
  return o == null ? 'N/A' : o.description ?? o.label
}

function createDescription(operator: string){
  if(checkCondition(operator)) return <header>如果<strong>{fmtOperatorText(operator)}</strong>条件被满足：</header>
  return null
}

function createContent(rule: LogicRule, field: FormField){
  if(checkCondition(rule.operator)) return null

  const value = (
    rule.operator == LogicOperator.EMPTY
      ? null
      : <input type="text" class="form-control" placeholder="目标值" v-model={rule.value}/>
  )

  const targetField = field.previous().find(f => f.name == rule.name)
  const operator = getOperator(rule.operator)

  return (
    <div class="xform-bs-logic-rule-content">
      <span>如果</span>
      <strong>{targetField ? targetField.title : 'N/A'}</strong>
      <span>的值</span>
      <strong>{operator.label}</strong>
      {value}    
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

function createRule(operator: string, field: FormField): LogicRule{
  return checkCondition(operator) ? { operator, condition: [] } : { operator, name: field.name, value: null }
}

function checkLogic(logic: LogicRule): any{
  if(logic == null) return null

  const condition = logic.condition
  if(Array.isArray(condition)){
    if(condition.length == 0) return false

    for(const c of condition){
      const r = checkLogic(c)
      if(r) return r
    }
  }

  if(!logic.name) return false
  if(logic.operator != LogicOperator.EMPTY && !logic.value) return false

  return true
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
          <span>如果</span>
          {name}
          <span>的值</span>
          <strong>{fmtOperatorText(rule.operator)}</strong>
          {rule.operator == LogicOperator.EMPTY ? null : <strong>{rule.value ?? 'N/A'}</strong>}
        </div>
      )
    }

    return function(){
      const rule = props.rule
      if(rule == null){
        return <span class="xform-bs-logic-rule-preview text-secondary">该字段尚未配置逻辑，请先添加一条规则</span>
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
            : <div class="xform-bs-logic-rule-preview text-secondary">请先添加一条子规则</div>
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

    function createButtons(isSelected: boolean){
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
        return <div class="xform-bs-logic-empty">请先添加一条规则</div>
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
            : <div class="xform-bs-logic-tips">请先添加一条子规则</div>
          : null
      )

      const description = createDescription(rule.operator)
      const content = createContent(rule, props.field)

      return (
        <div class={klass} onClick={select}>
          {description}
          {content}
          {createButtons(isSelected)}
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
    const selectedRule = ref<LogicRule>(null)
    const selectedField = ref<FormField>(null)
    const errorMessage = ref<string>(null)
    const showErrorMessage = ref(false)
    const disabled = computed(() => 
      (selectedRule.value == null && logic.value != null) || 
      (selectedRule.value != null && !checkCondition(selectedRule.value.operator))
    )

    function showModal(){
      const clone = JSON.parse(JSON.stringify(props.field.logic ?? null))
      logic.value = clone
      selectedRule.value = clone
      selectedField.value = null
      visible.value = true
    }

    function save(){
      if(!checkLogic(logic.value)) {
        let prevented = false

        rc.emit('message', {
          type: 'logic.validate',
          valid: false,
          title: '字段逻辑验证失败',
          content: (
            <div class="xform-bs-logic-error-content">
              <h5>如果存在以下未填写字段，请先补全：</h5>
              <p>-<strong>目标字段</strong></p>
              <p>-<strong>目标值</strong></p>
              <p>-<strong>子规则</strong></p>
            </div>
          ),
          message: '如果存在以下未填写字段，请先补全：\n - 目标字段\n - 目标值\n - 子规则',
          preventDefault: () => prevented = true
        })

        if(prevented) return

        errorMessage.value = '字段逻辑验证失败，请补全以下内容：目标字段、目标值、子规则'
        showErrorMessage.value = true
        return setTimeout(() => {
          showErrorMessage.value = false
        }, 3500)
      }
      
      rc.updateField(props.field, { prop: 'logic', value: logic.value })
      visible.value = false
    }

    function add(operator: string){
      const field = selectedField.value as FormField
      selectedField.value = null

      const rule = createRule(operator, field)
      if(logic.value == null) {
        logic.value = rule
        selectedRule.value = rule  
        return
      }

      checkCondition(selectedRule.value.operator) ? selectedRule.value.condition.push(rule) : selectedRule.value = rule
    }

    function selectRule(event: any){
      selectedRule.value = event
      selectedField.value = null
    }

    function selectField(event: any){
      if(disabled.value) return
      selectedField.value = event
    }

    function remove(){
      const target = selectedRule.value

      if(logic.value == target){
        logic.value = null
      } else {
        const parent = findParent(logic.value, target)
        const index = parent.condition.indexOf(target)
        if(index >= 0) parent.condition.splice(index, 1)
      }

      selectedRule.value = null
    }

    const previousFields = computed(() => {
      return props.field.previous().filter(f => {
        const o = f.conf?.operators
        if(o === false || Array.isArray(o) && o.length == 0) return false
        return true
      })
    })

    const fieldOperators = computed(() => {
      if(selectedField.value == null) return []

      const o = selectedField.value.conf?.operators
      return getOperators(Array.isArray(o) ? o : null).filter(o => {
        return COMMON_OPERATORS.indexOf(o.value) < 0
      })
    })

    return {
      commonOperators: computed(() => getOperators(COMMON_OPERATORS)),
      disabled,
      errorMessage,
      logic,
      fieldOperators,
      previousFields,
      selectedField,
      selectedRule,
      showErrorMessage,
      visible,
      add,
      remove,
      save,
      selectField,
      selectRule,
      showModal,
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
    padding: 0;
    min-height: 240px;
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

.xform-bs-logic-main{
  display: flex;
  flex-flow: row nowrap;
  height: 500px;
}

.xform-bs-logic-panel{
  width: 200px;
  border-right: 1px solid #dee2e6;

  h5{
    margin: 0;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    border-top: 1px solid #dee2e6;
    border-bottom: 1px solid #dee2e6;
    background-color: #f0f0f0;
    line-height: 20px;
  }

  .btn-link{
    float: right;
    padding: 0;
    font-size: 14px;
    border: none;
    height: 20px;
  }
}

.xform-bs-logic-graph{
  width: 0;
  flex: 1;
  padding: 15px 10px;
}

.xform-bs-logic-field{
  padding: 4px 10px;
  line-height: 20px;

  &.xform-is-selected,
  &:hover{
    background-color: #f0f0f0;
  }

  &.xform-is-disabled{
    cursor: not-allowed;
    color: #6c757d;
  }
}

.xform-bs-logic-operator{
  position: relative;
  padding: 4px 10px;
  line-height: 20px;

  &.xform-is-disabled{
    cursor: not-allowed;
    color: #6c757d;

    button{
      display: none;
    }
  }

  small{
    margin-left: 4px;
  }

  button{
    padding: 0;
    position: absolute;
    right: 10px;
    visibility: hidden;
  }

  &:hover{
    background-color: #f0f0f0;

    button{
      visibility: visible;
    }
  }
}

.xform-bs-logic-tips{
  color: #6c757d;
}

.xform-bs-logic-empty{
  color: #6c757d;
  text-align: center;
  padding-top: 120px;
}

.xform-bs-logic-errors{
  padding: 0 15px;
  margin-left: 10px;
  line-height: 31px;
  border-radius: 2px;
}

.xform-bs-logic-error-content{
  h5{
    margin: 0;
    font-weight: 400;
    font-size: 14px;
  }

  p{
    padding-left: 5px;
    margin: 0;
  }

  strong{
    margin-left: 4px;
  }
}

.xform-bs-logic-common-rule{
  h5{
    border-top: none;
  }
}

.xform-bs-logic-field-rule-tip{
  padding-left: 10px;
  color: #6c757d;
  padding-top: 4px;
}
</style>