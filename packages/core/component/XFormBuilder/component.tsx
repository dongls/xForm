import Store from '../../store'

import { 
  defineComponent, 
  provide,
  ref,
  h,
  Slots,
  resolveComponent,
  ComponentPublicInstance,
  watch,
  getCurrentInstance,
  nextTick,
  toRef,
  createVNode,
  Ref,
  computed,
} from 'vue'

import { 
  EnumComponent,
  PatchProps,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
  XFORM_MODEL_PROVIDE_KEY, 
  XField,
  XFormBuilderContext,
  XFormModel,
  XFormSchema,
  ValidateFunc,
  RawProps,
  ValidResult,
  EnumValidateMode,
} from '../../model'

import {
  fillComponentProps,
  flat,
  getFieldComponent,
  ignoreError,
  isFunction,
  isString,
  isValidArray,
  normalizeClass,
} from '../../util'

import { useValidator } from '../../validator'

interface XFormBuilderProps{
  mode: string;
  schema: XFormSchema;
  model: XFormModel;
  tag: string;
  novalidate: boolean;
}

interface XFormBuilderSetupState{
  update: Function;
  validate: () => Promise<{
    result: ValidResult[],
    valid: boolean
  }>,
  reset: Function;
}

type XFormBuilderInstance = ComponentPublicInstance & XFormBuilderProps & XFormBuilderSetupState;

const EVENTS = {
  CHANGE: 'change',
  UPDATE_MODEL: 'update:model',
  SUBMIT: 'submit'
}

/**
 * 根据字段创建对应的组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`name_[name]`的slot
 * 2. 检索是否有名为`type_[type]`的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderContent(instance: XFormBuilderInstance, field: XField, patch?: PatchProps){
  const slots = instance.$slots
  const value = instance.model[field.name]

  const nameSlot = slots[`name_${field.name}`]
  if(isFunction(nameSlot)) return nameSlot({ field, value })

  const typeSlot = slots[`type_${field.type}`]
  if(isFunction(typeSlot)) return typeSlot({ field, value })

  const all = {
    field,
    value,
    'onUpdate:value': instance.update
  }
  const component = getFieldComponent(field, EnumComponent.BUILD, instance.mode)
  if(null == component) return null

  const props = fillComponentProps(component, all)
  return createVNode(component, isFunction(patch) ? patch(props) : props)
}

function renderField(instance: XFormBuilderInstance, field: XField, patch?: PatchProps){
  const content = renderContent(instance, field, patch)
  const XFormItem = resolveComponent('xform-item')
  const itemProps = { key: field.name, field, validation: true }

  return h(XFormItem, itemProps, function(){
    if(null == content) {
      console.warn(`[xform] field not implement build component: ${field.title}(${field.name})`)
      return <p class="xform-is-unknown">暂不支持的字段类型</p>
    }
  
    return content
  })
}

export default defineComponent({
  name: 'xform-builder',
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: null
    },
    schema: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      default: 'form'
    },
    novalidate: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    EVENTS.CHANGE, 
    EVENTS.UPDATE_MODEL,
    EVENTS.SUBMIT
  ],
  setup(props: XFormBuilderProps, { emit }){
    const instance = getCurrentInstance()
    const pending = ref(false)
    const preventValidate = ref(false)
    const isEnableValidate = computed(() => !preventValidate.value && props.novalidate !== true)
    const validator = useValidator(isEnableValidate)

    function registerField(fieldRef: Ref<XField>, validationRef: Ref<boolean | ValidateFunc>){      
      const key = fieldRef.value.name
      const stopHandle = watch(() => props.model[key], () => {
        if(!Store.isImmediateValidate() || pending.value) return
        ignoreError(validator.validateField(fieldRef.value, props.model))
      })

      const eventHandle = () => {
        if(pending.value) return
        ignoreError(validator.validateField(fieldRef.value, props.model, { mode: EnumValidateMode.SLEF }))
      }

      if(fieldRef.value && isValidArray(fieldRef.value.fields)){
        fieldRef.value.fields.forEach(sub => sub.on(XField.EVENT_VALID_CHANGE, eventHandle))
      }

      validator.registerField(key, { fieldRef, validationRef, stopHandle, eventHandle })
    }
    
    function removeField(key: string){
      const state = validator.removeField(key)
      if(null != state) {
        const field = state.fieldRef.value
        state.stopHandle()

        if(isValidArray(field.fields)){
          field?.fields.forEach(sub => sub.off(XField.EVENT_VALID_CHANGE, state.eventHandle))
        }
      }
    }

    function update(event: any){
      const model = props.model
      const { value, name } = event

      model[name] = value

      emit(EVENTS.UPDATE_MODEL, model)
      emit(EVENTS.CHANGE, event)
    }

    // 清除验证信息
    function resetValidate(){
      const fields = validator.getRegisteredFields()
      for(const field of fields){
        validator.resetFieldValidation(field)
      }
    }

    provide(XFORM_MODEL_PROVIDE_KEY, toRef(props, 'model'))
    provide(XFORM_FORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<XFormBuilderContext>(XFORM_CONTEXT_PROVIDE_KEY, {
      type: 'builder',
      registerField, 
      removeField, 
      updateFieldValue: update,
      renderField: renderField.bind(null, instance.proxy),
      novalidate: toRef(props, 'novalidate')
    })

    return {
      // 验证整个表单
      validate(flat = false){
        if(pending.value) return Promise.reject('[xform error]: validate pending...')
        
        pending.value = true
        return validator.validateSchema(props.schema, props.model, flat).then(result => {
          pending.value = false
          return result
        })
      },
      // 根据字段name验证任意个字段
      validateField(...args: string[]){
        const names = flat(args)
        if(names.length == 0) return

        for(const name of names){
          ignoreError(validator.validateFieldByName(name, props.model))
        }
      },
      // 重置表单验证
      resetValidate,
      // 重置表单
      reset(){
        preventValidate.value = true
        emit(EVENTS.UPDATE_MODEL, {})
        resetValidate()
        nextTick(() => preventValidate.value = false)
      },
      update,
      registerField,
      removeField
    }
  },
  render(instance: XFormBuilderInstance){
    const slots = instance.$slots as Slots
    const model = instance.model
    const schema = instance.schema
    const tagName = (isString(instance.tag) ? instance.tag : 'form').toLowerCase()

    const props = { 
      ...instance.$attrs,
      novalidate: tagName == 'form'
    } as RawProps

    const klass = normalizeClass(props.class)
    klass['xform-builder'] = true
    props.class = klass

    if(tagName == 'form'){
      props.onSubmit = (event: Event) => {
        event.preventDefault()
        instance.$emit(EVENTS.SUBMIT, instance.validate, model)
      }

      props.onReset = (event: Event) => {
        event.preventDefault()
        instance.reset()
      }
    }
    
    const main = (
      <div class="xform-builder-main">
        {isFunction(slots.header) && slots.header()}
        {schema.fields.map(field => renderField(instance, field))}
        {isFunction(slots.default) && slots.default()}
        {isFunction(slots.footer) && slots.footer()}
      </div>
    )
        
    return h(tagName, props, main)
  }
})