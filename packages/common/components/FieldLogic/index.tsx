import classes from './index.module.scss'

import { 
  computed, 
  defineComponent, 
  inject, 
  onBeforeUnmount, 
  PropType, 
  provide, 
  Ref, 
  ref, 
  toRef, 
  watch
} from 'vue'

import { 
  FieldLogic, 
  FormField, 
  FormFieldLogic, 
  getComposedLogic, 
  getLogic, 
  useConstant
} from '@dongls/xform'

const EDITOR_CONTEXT = __IS_DEV__ ? Symbol('LogicEditorRenderContext') : Symbol()
const { CLASS } = useConstant()

export interface LogicEditorApi {
  validate: () => void
  submit: () => {
    valid: boolean,
    data?: FormFieldLogic
  }
}

interface RenderContext {
  selectLogic: (logic: FormFieldLogic) => void
  field: Ref<FormField>
}

interface ComposedLogicContext{
  composedLogic: FieldLogic[]
  disabled: Ref<boolean>
  add: (fieldLogic: FieldLogic) => void
}

interface FieldLogicContext{
  disabled: Ref<boolean>
  previous: FormField[]
  selectedField: Ref<FormField>
  add: (fieldLogic: FieldLogic) => void
  selectField: (field: FormField) => void
}

function createComposedLogic(context: ComposedLogicContext){
  const { composedLogic, disabled, add } = context
  if(composedLogic.length == 0) return null

  const items = composedLogic.map(l => {
    const _p: any = {
      'class': { 
        [classes.logicItem]: true, 
        [CLASS.IS_DISABLED]: disabled.value 
      }
    }

    if(!disabled.value) _p.onClick = add.bind(null, l)

    return <div {..._p}><strong>{l.title}</strong></div>
  })

  return (
    <div class={[classes.composedLogic]}>
      <h5>组合逻辑</h5>
      <div class={[classes.composedLogicList, CLASS.IS_SCROLL]}>{items}</div>
    </div>
  )
}

function createPreviousField(context: FieldLogicContext){
  return context.previous.map(p => {
    const className = { 
      [classes.logicItem]: true, 
      [CLASS.IS_DISABLED]: context.disabled.value 
    }

    return (
      <div class={className} onClick={context.selectField.bind(null, p)}>
        <strong>{p.title}</strong>
      </div>
    )
  })
}

function createSelectedFieldLogic(context: FieldLogicContext){
  const { selectedField, add } = context
  const field = selectedField.value.conf
  return field.logic.map(logic => {
    const _p: any = { 
      'class': { 
        [classes.logicItem]: true, 
        [CLASS.IS_DISABLED]: context.disabled.value 
      }
    }

    if(!context.disabled.value) _p.onClick = add.bind(null, logic)

    return <div {..._p}><strong>{logic.title}</strong></div>
  })
}

function createFieldLogic(context: FieldLogicContext){
  const { previous, selectedField } = context
  if(previous.length == 0) return null

  const back = selectedField.value == null ? null : <button type='button' class={classes.textButton} onClick={context.selectField.bind(null, null)}>返回</button>
  const title = selectedField.value == null ? '字段逻辑' : selectedField.value.title
  return (
    <div class={classes.fieldLogic}>
      <h5>
        <span>{title}</span>
        {back}
      </h5>
      <div class={[classes.fieldLogicList, CLASS.IS_SCROLL]}>
        {selectedField.value == null ? createPreviousField(context) : createSelectedFieldLogic(context)}
      </div>
    </div>
  )
}

function createLogic(fieldLogic: FieldLogic, field: FormField, rootField: FormField) {
  return FormFieldLogic.create(
    fieldLogic.composed === true 
      ? { type: fieldLogic.type, conditions: [] } 
      : { type: fieldLogic.type, field: field.name },
    rootField
  )
}

function initLogic(origin: FormFieldLogic, rootField: FormField){
  if(origin == null) return null

  const clone = JSON.parse(JSON.stringify(origin))
  return FormFieldLogic.create(clone, rootField)
}

function validate(logic: FormFieldLogic, valid: Ref<boolean>, rootField: FormField, isRoot = true){
  if(logic == null && isRoot) {
    valid.value = true
    return
  }

  const fieldLogic = getLogic(logic.type)
  if(fieldLogic != null && typeof fieldLogic.validator == 'function'){
    const r = fieldLogic.validator(logic, rootField)
    logic.message = (
      typeof r == 'string'
        ? r
        : r === false
          ? false
          : null
    )

    valid.value = logic.message == null
  }

  if(Array.isArray(logic.conditions) && logic.conditions.length > 0){
    logic.conditions.forEach(c => validate(c as any, valid, rootField, false))
  }
}

export const LogicGraph = defineComponent({
  name: 'logic-graph',
  props: {
    logic: {
      type: Object as any as PropType<FormFieldLogic>,
      default: null
    },
    selected: {
      type: Object as any as PropType<FormFieldLogic>,
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
      type: Object as any as PropType<FormFieldLogic>,
      default: null
    },
  },
  emits: ['select', 'remove', 'update:logic'],
  setup(props, { emit }){
    const rc = inject<RenderContext>(EDITOR_CONTEXT)

    function select(event: Event){
      event.stopPropagation()
      rc.selectLogic(props.logic)
    }

    function up(event: Event){
      event.stopPropagation()

      const parent = props.parent
      if(null == parent) return

      const current = props.logic
      const conditions = parent.conditions
      const index = conditions.indexOf(current)
      if(index < 0) return

      const item = conditions.splice(index, 1)[0]
      conditions.splice(index - 1, 0, item)
    }

    function down(event: Event){
      event.stopPropagation()

      const parent = props.parent
      if(null == parent) return

      const current = props.logic
      const conditions = parent.conditions
      const index = conditions.indexOf(current)
      if(index < 0) return

      const item = conditions.splice(index + 1, 1)[0]
      conditions.splice(index, 0, item)
    }

    function remove(event: Event){
      event.stopPropagation()

      const parent = props.parent
      if(null == parent) {
        emit('update:logic', null)
        rc.selectLogic(null)
        return
      }

      const current = props.logic
      const conditions = parent.conditions
      const index = conditions.indexOf(current)
      if(index < 0) return

      conditions.splice(index, 1)
    }

    function createButtons(isSelected: boolean){
      if(!isSelected) return null

      return (
        <div class={classes.logicGraphButtons}>
          {props.first === 'N' && <button type="button" onClick={up} class={classes.textButton}>上移</button>}
          {props.last === 'N' && <button type="button" onClick={down} class={classes.textButton}>下移</button>}
          <button type="button" onClick={remove} class={[classes.textButton, classes.danger]}>删除</button>
        </div>
      )
    }

    return function(){
      const logic = props.logic
      if(logic == null) {
        return <div class={classes.logicEmpty}>请先添加一条逻辑</div>
      }
      
      const fieldLogic = getLogic(logic.type)
      const isSelected = props.selected == props.logic

      if(fieldLogic == null) {
        const klass = {
          [classes.logicGraph]: true,
          'is-selected': props.selected == props.logic,
        }

        return (
          <div class={klass} onClick={select}>
            <div class={CLASS.IS_UNKNOWN}>暂不支持的字段逻辑</div>
            {createButtons(isSelected)}
          </div>
        )
      }

      const conditions = (
        fieldLogic.composed !== true
          ? null
          : !Array.isArray(logic.conditions) || logic.conditions.length == 0
            ? <div class={classes.logicInlineEmpty}>请先添加一条子逻辑</div>
            : logic.conditions.map((l, index) => {
              return (
                <logic-graph
                  logic={l}
                  parent={logic}
                  first={index == 0 ? 'Y' : 'N'}
                  last={index == logic.conditions.length - 1 ? 'Y' : 'N'}
                  selected={props.selected}
                />
              )
            })
      )

      const klass = {
        [classes.logicGraph]: true,
        'is-composed': fieldLogic.composed,
        'is-selected': props.selected == props.logic,
        'is-error': typeof logic.message == 'string' || logic.message === false
      }

      const message = typeof logic.message == 'string' ? <div class={classes.errorMessage}>{logic.message}</div> : null

      return (
        <div class={klass} onClick={select}>
          {fieldLogic.render(logic, rc.field.value)}
          {conditions}
          {message}
          {createButtons(isSelected)}
        </div>
      )
    }
  }
})

export const LogicEditor = defineComponent({
  name: 'logic-editor',
  props: {
    field: {
      type: FormField,
      required: true
    }
  },
  setup(props, { expose }){
    const composedLogic = getComposedLogic()
    const previousFields = props.field.previous().filter(f => {
      return Array.isArray(f.conf.logic) && f.conf.logic.length > 0
    })

    const root = ref(initLogic(props.field?.logic, props.field))
    const selected = ref<FormFieldLogic>(null)
    const selectedField = ref<FormField>(null)
    const valid = ref<boolean>(null)

    const disabled = computed(() => 
      (selected.value == null && root.value != null) || 
      (selected.value != null && !Array.isArray(selected.value.conditions))
    )

    function add(fieldLogic: FieldLogic){
      const field = selectedField.value
      const newLogic = createLogic(fieldLogic, field, props.field)

      if(selected.value == null){
        root.value = newLogic
        select(newLogic)
        return 
      }

      if(!Array.isArray(selected.value.conditions)){
        selected.value = newLogic
        select(newLogic)
        return 
      }

      selected.value.conditions.push(newLogic)
      select(newLogic)
    }

    function select(event: any){
      selected.value = event
      selectedField.value = null
    }

    function submit(){
      if(valid.value == null) validate(root.value, valid, props.field)
      if(valid.value === false) return { valid: false }

      return { valid: true, data: root.value }
    }

    function selectField(field: FormField){
      if(disabled.value) return
      selectedField.value = field
    }

    provide<RenderContext>(EDITOR_CONTEXT, {
      selectLogic: select,
      field: toRef(props, 'field')
    })

    onBeforeUnmount(watch(root, () => validate(root.value, valid, props.field), { deep: true }))

    expose({ 
      submit,
      validate: () => validate(root.value, valid, props.field)
    })

    return function(){
      const composedLogicContext: ComposedLogicContext = {
        composedLogic, 
        disabled, 
        add
      }

      const fieldLogicContext: FieldLogicContext = {
        disabled,
        previous: previousFields,
        selectedField,
        selectField,
        add
      }

      return (
        <div class={classes.main}>
          <div class={[classes.panel, 'xform-is-scroll']}>
            {createComposedLogic(composedLogicContext)}
            {createFieldLogic(fieldLogicContext)}
          </div>
          <div class={[classes.graph, 'xform-is-scroll']}>
            <LogicGraph v-model={[root.value, 'logic']} selected={selected.value}/>
          </div>
        </div>
      )
    }
  }
})