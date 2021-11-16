<template>
  <section class="xform-el-field-setting-prop">
    <header>
      <span title="如果满足配置的条件则显示字段，否则隐藏字段">逻辑：</span>
      <el-button type="text" @click="showModal" class="is-logic-btn" :auto-insert-space="false">配置</el-button>
    </header>
    <logic-rule-preview :rule="field.logic" :field="field"/>

    <el-dialog 
      v-model="visible"
      title="配置逻辑"
      width="840px"
      custom-class="xform-el-logic-dialog"
      append-to-body
    >
      <div class="xform-el-logic-main">
        <div class="xform-el-logic-panel xform-is-scroll">
          <div class="xform-el-logic-common-rule">
            <h5>通用规则</h5>
            <div>
              <div 
                v-for="operator in commonOperators" :key="operator.value"
                class="xform-el-logic-operator" :class="{'xform-is-disabled': disabled}"
              >
                <strong>{{ operator.label }}</strong>
                <small class="xform-el-logic-text-secondary" v-if="operator.code">{{ operator.code }}</small>
                <el-button type="text" @click="add(operator.value)" :auto-insert-space="false">添加</el-button>
              </div>
            </div>
          </div>

          <div class="xform-el-logic-field-rule">
            <h5>
              <strong>字段规则</strong>
              <el-button type="text" @click="selectedField = null" v-if="selectedField != null" :auto-insert-space="false">返回</el-button>
            </h5>
            <div v-if="selectedField == null">
              <div 
                v-for="f in previousFields" :key="f.name" 
                class="xform-el-logic-field" 
                :class="{'xform-is-selected': f == selectedField, 'xform-is-disabled': disabled}"
                @click="selectField(f)"
              ><strong>{{ f.title }}</strong></div>
              <div class="xform-el-logic-field-rule-tip" v-if="previousFields.length == 0">暂无可用的字段规则</div>
            </div>
            <div v-if="fieldOperators.length > 0">
              <div 
                v-for="operator in fieldOperators" :key="operator.value"
                class="xform-el-logic-operator" :class="{'xform-is-disabled': disabled}"
              >
                <strong>{{ operator.label }}</strong>
                <small class="xform-el-logic-text-secondary" v-if="operator.code">{{ operator.code }}</small>
                <el-button type="text" @click="add(operator.value)" :auto-insert-space="false">添加</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="xform-el-logic-graph xform-is-scroll">
          <logic-rule 
            :rule="logic"
            :field="field" 
            :selected="selectedRule"
            @select="selectRule" 
            @remove="remove" 
          />
        </div>
      </div>
      <template #footer>
        <div class="xform-el-logic-errors" v-if="showErrorMessage">{{ errorMessage }}</div>
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button @click="save" type="primary" size="small">确定</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="tsx">
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

const { BuiltInLogicOperator } = useConstant()
const COMMON_OPERATORS = [
  BuiltInLogicOperator.AND,
  BuiltInLogicOperator.OR,
  BuiltInLogicOperator.NOT
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
    rule.operator == BuiltInLogicOperator.EMPTY
      ? null
      : <el-input size="small" placeholder="目标值" v-model={rule.value}/>
  )

  const targetField = field.previous().find(f => f.name == rule.name)
  const operator = getOperator(rule.operator)

  return (
    <div class="xform-el-logic-rule-content">
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
  if(logic.operator != BuiltInLogicOperator.EMPTY && !logic.value) return false

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
        <div class="xform-el-logic-preview-content">
          <span>如果</span>
          {name}
          <span>的值</span>
          <strong>{fmtOperatorText(rule.operator)}</strong>
          {rule.operator == BuiltInLogicOperator.EMPTY ? null : <strong>{rule.value ?? 'N/A'}</strong>}
        </div>
      )
    }

    return function(){
      const rule = props.rule
      if(rule == null){
        return <span class="xform-el-logic-rule-preview xform-el-logic-text-secondary">该字段尚未配置逻辑，请先添加一条规则</span>
      }

      const hasCondition = checkCondition(rule.operator)
      const klass = {
        'xform-el-logic-rule-preview': true,
        'has-condition': hasCondition
      }
      const condition = (
        hasCondition
          ? Array.isArray(rule.condition) && rule.condition.length > 0 
            ? rule.condition.map(r => <logic-rule-preview rule={r} field={props.field}/>)
            : <div class="xform-el-logic-rule-preview xform-el-logic-text-secondary">请先添加一条子规则</div>
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
        <div class="xform-el-logic-rule-buttons">
          {props.first === 'N' && <a href="javascript:;" onClick={up}>上移</a>}
          {props.last === 'N' && <a href="javascript:;" onClick={down}>下移</a>}
          <a href="javascript:;" onClick={remove} class="xform-el-logic-is-danger">删除</a>
        </div>
      )
    }

    return function(){
      const rule = props.rule
      if(rule == null){
        return <div class="xform-el-logic-empty">请先添加一条规则</div>
      }

      const isSelected = props.selected == props.rule
      const hasCondition = checkCondition(rule.operator) 
      const klass = {
        'xform-el-logic-rule': true,
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
            : <div class="xform-el-logic-tips">请先添加一条子规则</div>
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
      if(checkLogic(logic.value) === false) {
        let prevented = false

        rc.emit('message', {
          type: 'logic.validate',
          valid: false,
          title: '字段逻辑验证失败',
          content: (
            <div class="xform-el-logic-error-content">
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
  min-height: 0;
}

.xform-el-logic-dialog{
  .el-dialog__title{
    font-weight: 700;
  }

  .el-dialog__header{
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color-base);
  }

  .el-dialog__body{
    padding: 0;
    max-height: calc(100vh - 200px);
    overflow: auto;
    min-height: 240px;
  }
  
  .el-dialog__footer{
    border-top: 1px solid var(--el-border-color-base);
    padding: 10px;
  }
}

.xform-el-logic-rule{
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

  & + .xform-el-logic-rule{
    margin-top: 15px;
  }

  &.is-selected{
    border-color: #007bff;
    border-style: solid;
  }

  & > .xform-el-logic-rule::after{
    content: "";
    position: absolute;
    width: 20px;
    left: -20px;
    top: 50%;
    border-bottom: 1px dashed #ccc;
  }
}

.xform-el-logic-rule-content{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .el-input{
    width: 120px;
  
    .el-input__inner{
      height: 25px;
      line-height: 23px;
      padding-left: 8px;
      padding-right: 8px;
      border-radius: 3px;
      font-weight: 700;
    }
  }

  strong{
    margin: 0 4px;

    & + strong{
      margin-left: 0;
    }
  }

  .xform-el-logic-rule-operator{
    width: 60px;
  }
}

.xform-el-logic-rule-buttons{
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
    text-decoration: none;
    color: var(--el-color-primary);

    &.xform-el-logic-is-danger{
      color: var(--el-color-danger); 
    }

    &:hover{
      text-decoration: underline;
    }
  }
}

.xform-el-logic-rule-preview{
  position: relative;
  line-height: 24px;

  strong, a{
    margin: 0 4px;
  }

  & > .xform-el-logic-rule-preview{
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

.xform-el-logic-preview-content a{
  color: var(--el-color-primary);
  text-decoration: none;

  &:hover{
    text-decoration: underline;
  }
}

.xform-el-logic-main{
  display: flex;
  flex-flow: row nowrap;
  height: 500px;
}

.xform-el-logic-panel{
  width: 200px;
  border-right: 1px solid #dee2e6;

  h5{
    margin: 0;
    font-size: 14px;
    padding: 4px 10px;
    border-top: 1px solid #dee2e6;
    border-bottom: 1px solid #dee2e6;
    background-color: #f0f0f0;
    line-height: 20px;
  }

  .el-button{
    float: right;
    padding: 0;
    font-size: 14px;
    border: none;
    height: 20px;
    min-height: 0;
  }
}

.xform-el-logic-graph{
  width: 0;
  flex: 1;
  padding: 15px 10px;
}

.xform-el-logic-field{
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

.xform-el-logic-operator{
  position: relative;
  padding: 4px 10px;
  line-height: 20px;

  &.xform-is-disabled{
    cursor: not-allowed;
    color: #6c757d;

    .el-button{
      display: none;
    }
  }

  small{
    margin-left: 4px;
  }

  .el-button{
    position: absolute;
    right: 10px;
    top: 6px;
    padding: 0;
    visibility: hidden;
    min-height: 0;
    line-height: 20px;
  }

  &:hover{
    background-color: #f0f0f0;

    .el-button{
      visibility: visible;
    }
  }
}

.xform-el-logic-tips{
  color: #6c757d;
}

.xform-el-logic-empty{
  color: #6c757d;
  text-align: center;
  padding-top: 120px;
}

.xform-el-logic-errors{
  padding: 0 12px;
  margin-left: 10px;
  line-height: 32px;
  border-radius: 2px;

  position: absolute;
  left: 0;
  background-color: var(--el-color-error);
  color: #fff;
}

.xform-el-logic-error-content{
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

.xform-el-logic-common-rule{
  h5{
    border-top: none;
  }
}

.xform-el-logic-field-rule-tip{
  padding-left: 10px;
  color: #6c757d;
  padding-top: 4px;
}

.xform-el-logic-text-secondary{
  color: var(--el-text-color-secondary);
}
</style>