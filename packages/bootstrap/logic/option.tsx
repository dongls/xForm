import classes from './index.module.scss'

import { Field, FormField, FormFieldLogic, isEmpty, useConstant } from '@dongls/xform'
import { Operators as O } from '@common/operator'
import { computed, defineComponent, nextTick, onBeforeUnmount, PropType, ref } from 'vue'
import { createWarnTip } from './common'

interface OptionLogic extends FormFieldLogic {
  operator?: string
}

const { CLASS, SELECTOR } = useConstant()

const MultipleSelect = defineComponent({
  name: 'multiple-select',
  props: {
    options: {
      required: true,
      type: Array as any as PropType<any[]>
    },
    modelValue: {
      default: null,
      type: Array as any as PropType<any[]>
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }){
    const panelRef = ref<HTMLElement>(null)
    const rootRef = ref<HTMLElement>(null)

    const isOpen = ref(false)
    const position = ref(1)
    const isEmpty = computed(() => {
      return !Array.isArray(props.modelValue) || props.modelValue.length == 0
    })

    function choose(option: any, event: MouseEvent){
      event.stopPropagation()

      const value = Array.isArray(props.modelValue) ? props.modelValue : []
      const index = value.indexOf(option.value)

      index >= 0 ? value.splice(index, 1) : value.push(option.value)
      emit('update:modelValue', value)
    }

    function calcPosition(target: HTMLElement){
      if(panelRef.value == null) return 1

      const panel = panelRef.value
      const container = panel.closest(SELECTOR.IS_SCROLL)
      if(container == null) return 1

      const pRect = panel.getBoundingClientRect()
      const cRect = container.getBoundingClientRect()
      const tRect = target.getBoundingClientRect()

      if(tRect.bottom + pRect.height > cRect.bottom) return -1
      return 1
    }

    async function showPanel(event: MouseEvent){
      isOpen.value = !isOpen.value
      
      if(!isOpen.value) return
      await nextTick()
      position.value = calcPosition(event.target as HTMLElement)
    }

    function handleOutsideClick(event: MouseEvent){
      const target = event.target
      if(!(target instanceof Element) || rootRef.value == null) return

      if(!rootRef.value.contains(target)) isOpen.value = false
    }

    function removeFirst(event: MouseEvent){
      event.stopPropagation()

      const value = props.modelValue
      value.splice(0, 1)
      emit('update:modelValue', value)
    }

    document.addEventListener('click', handleOutsideClick,  true)
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleOutsideClick, true)
    })

    function createContent(){
      const value = props.modelValue
      if(value.length == 1){
        return (
          <div class={classes.multipleSelectContent}>
            <div class={classes.multipleSelectTags}>
              <div class={[classes.multipleSelectTag, classes.isSingle]}>{value[0]}</div>
            </div>
          </div>
        )
      }

      const [first, ...other] = value

      return (
        <div class={classes.multipleSelectContent}>
          <div class={classes.multipleSelectTags}>
            <div class={classes.multipleSelectTag}>
              <span class={classes.multipleSelectTagContent}>{first}</span>
              <button type='button' class="btn-close shadow-none" onClick={removeFirst}/>
            </div>
          </div>
          <div class={classes.multipleSelectCount}>+{other.length}</div>
        </div>
      )
    }

    return function(){
      const options = props.options.map((option: any) => {
        const klass = {
          [classes.multipleSelectOption]: true,
          [classes.isSelected]: props.modelValue && props.modelValue.includes(option.value)
        }

        return (
          <div class={klass} onClick={choose.bind(null, option)}>{option.label ?? option.value}</div>
        )
      })

      const klass = {
        [classes.multipleSelect]: true,
        [classes.isOpen]: isOpen.value,
        [classes.isBottom]: position.value === 1,
        [classes.isTop]: position.value === -1
      }

      const content = (
        isEmpty.value 
          ? <div class={classes.multipleSelectPlaceholder}>请选择目标值</div>
          : createContent()
      )

      return (
        <div class={klass} ref={rootRef}>
          <div class={classes.multipleSelectInput} onClick={showPanel}>
            {content}
          </div>
          <div class={classes.multipleSelectPanel} ref={panelRef}>
            <div class={[classes.multipleSelectOptions, CLASS.IS_SCROLL]}>{options}</div>
          </div>
        </div>
      )
    }
  }
})

function createLogicValue(logic: OptionLogic, target: FormField){
  if(logic.operator == O.OPERATOR_EMPTY.type) return null
  if(logic.operator == O.OPERATOR_CONTAINS.type) {
    return <input type='text' class="form-control form-control-sm" v-model={logic.value} placeholder="目标值"/>
  }

  if(!Array.isArray(target.options)) return null

  const isMultiple = (
    logic.operator == O.OPERATOR_OPTION_EQ.type ||
    logic.operator == O.OPERATOR_OPTION_NE.type || 
    logic.operator == O.OPERATOR_OPTION_CONTAINS.type
  )

  if(isMultiple) {
    return <MultipleSelect options={target.options} v-model={logic.value}/>
  }

  const options = target.options.map(option => {
    return <option value={option.value}>{option.label ?? option.value}</option>
  })

  return (
    <select class="form-control form-control-sm" v-model={logic.value}>
      <option value={null} disabled>-- 请选择目标值 --</option>
      {options}
    </select>
  )
}

function isSafeOption(logic: OptionLogic, rootField: FormField){
  if(!(rootField instanceof FormField) || logic.value == null) return false

  const targetField = rootField.previous().find(f => f.name == logic.field)
  if(targetField == null) return false

  const options = targetField.options
  if(!Array.isArray(options) || options.length == 0) return false

  const value = Array.isArray(logic.value) ? logic.value : [logic.value]

  for(const item of value){
    if(options.find(i => i.value === item) == null) return false
  }

  return true
}

export const OPTION_VALUE_COMPARE = Field.createFieldLogic({
  type: 'option_value_compare',
  title: '值',
  render(logic: OptionLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_EQ,
      O.OPERATOR_NE,
      O.OPERATOR_CONTAINS,
      O.OPERATOR_EMPTY,
    ].map(o => <option value={o.type}>{o.title}</option>)

    const operator = <select class={`form-control form-control-sm ${classes.logicOperator}`} v-model={logic.operator}>{options}</select>
    const value = createLogicValue(logic, targetField)

    return (
      <div class={classes.logicForm}>
        <span>如果</span>
        <strong>{targetField.title}</strong>
        <span>的值</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: OptionLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true

    return operator.test(target.value, logic.value)
  },
  validator(logic: OptionLogic, rootField: FormField){
    if(logic.operator == O.OPERATOR_EMPTY.type) return true
    if(logic.operator == O.OPERATOR_CONTAINS.type){
      return isEmpty(logic.value) ? '请输入目标值' : true
    }

    if(isEmpty(logic.value) || !isSafeOption(logic, rootField)) return '请选择目标值'
    return true
  },
  onCreated(logic: OptionLogic, rootField: FormField){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_EQ.type
    }

    if(
      logic.operator != O.OPERATOR_CONTAINS.type && 
      !isSafeOption(logic, rootField)
    ){
      logic.value = null
    }
  }
})

export const MULTIPLE_OPTION_VALUE_COMPARE = Field.createFieldLogic({
  type: 'multiple_option_value_compare',
  title: '值',
  render(logic: OptionLogic, field){
    const targetField = field.previousField(logic.field)
    if(targetField == null) return createWarnTip(logic, field)

    const options = [
      O.OPERATOR_OPTION_EQ,
      O.OPERATOR_OPTION_NE,
      O.OPERATOR_OPTION_CONTAINS,
      O.OPERATOR_EMPTY,
    ].map(o => <option value={o.type}>{o.title}</option>)

    const operator = <select class={`form-control form-control-sm ${classes.logicOperator}`} v-model={logic.operator}>{options}</select>
    const value = createLogicValue(logic, targetField)

    return (
      <div class={classes.logicForm}>
        <span>如果</span>
        <strong>{targetField.title}</strong>
        <span>的值</span>
        {operator}
        {value}
      </div>
    )
  },
  test(logic: OptionLogic, field){
    const operator = O.get(logic.operator)
    if(operator == null) return true

    const target = field.previousField(logic.field)
    if(target == null) return true

    return operator.test(target.value, logic.value)
  },
  onCreated(logic: OptionLogic, rootField: FormField){
    if(logic.operator == null) {
      logic.operator = O.OPERATOR_OPTION_EQ.type
    }

    if(!isSafeOption(logic, rootField)){
      logic.value = null
    }
  }
})