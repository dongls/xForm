import { 
  ComponentPublicInstance,
  Ref,
  Slots,
  createVNode,
  defineComponent, 
  getCurrentInstance,
  h,
  provide,
  ref,
  toRef,
  nextTick,
  ComputedOptions,
} from 'vue'

import { 
  EnumComponent,
  RawProps,
  RenderOptions,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
  XField,
  XFormBuilderContext,
  XFormSchema,
  XSchema,
} from '../../model'

import {
  fillComponentProps,
  getFieldComponent,
  isFunction,
  isString,
  normalizeClass,
} from '../../util'

import { useValidator, ValidateOptions } from '../../validator'
import { XFormItemInternal } from '../XFormItem/component'

interface XFormBuilderProps{
  mode: string;
  schema: XFormSchema;
  tag: string;
  novalidate: boolean;
  disabled: boolean;
}

interface XFormBuilderSetupState{
  onUpdateValue: Function;
  validate: () => Promise<{valid: boolean, model?: any}>;
  reset: Function;
}

type XFormBuilderInstance = ComponentPublicInstance & XFormBuilderProps & XFormBuilderSetupState;

const EVENTS = {
  VALUE_CHANGE: 'value:change',
  SUBMIT: 'submit',
}

function renderUnknown(field: XField){
  console.warn(`[xform] field not implement build component: ${field.title}(${field.name})`)
  return <p class="xform-is-unknown">暂不支持的字段类型</p>
}

/**
 * 根据字段创建对应的组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`name_[name]`的slot
 * 2. 检索是否有名为`type_[type]`的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderContent(instance: XFormBuilderInstance, field: XField, options: RenderOptions){
  const slots = instance.$slots
  const value = field.value
  const disabled = instance.disabled || field.disabled || options.parentProps?.disabled === true

  const nameSlot = slots[`name_${field.name}`]
  if(isFunction(nameSlot)) return nameSlot({ field, value, disabled })

  const typeSlot = slots[`type_${field.type}`]
  if(isFunction(typeSlot)) return typeSlot({ field, value, disabled })

  const all = { field, value, 'onUpdate:value': instance.onUpdateValue, disabled }
  const component = getFieldComponent(field, EnumComponent.BUILD, instance.mode)
  if(null == component) return null

  const props = fillComponentProps(component, all)
  const create = isFunction(options.renderContent) ? options.renderContent : createVNode
  return create(component, props)
}

function renderField(instance: XFormBuilderInstance, field: XField, options: RenderOptions = {}){
  if(field.hidden === true) return null

  const disabled = instance.disabled || field.disabled || options.parentProps?.disabled === true
  const props = { 
    key: field.uid, 
    field, 
    validation: !instance.novalidate && !disabled, 
    disabled
  } as RawProps

  const children = function(){
    return renderContent(instance, field, options) ?? renderUnknown(field)
  }

  const create = isFunction(options.renderItem) ? options.renderItem : h
  return create(XFormItemInternal as ComputedOptions, props, children)
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
      type: XSchema,
      required: true
    },
    tag: {
      type: String,
      default: 'form'
    },
    novalidate: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    EVENTS.VALUE_CHANGE, 
    EVENTS.SUBMIT
  ],
  setup(props: XFormBuilderProps, { emit }){
    const instance = getCurrentInstance()
    const pending = ref(false)
    const preventValidate = ref(false)
    const validator = useValidator({ onValueChange })

    function onValueChange(e: any){
      emit(EVENTS.VALUE_CHANGE, e)
    }

    function onUpdateValue(e: { field: XField, value: any }){
      e.field.value = e.value
    }

    function registerField(fieldRef: Ref<XField>, isExternal: boolean){   
      if(isExternal) props.schema.registerExternalField(fieldRef.value)
      
      validator.registerField(fieldRef.value.uid, {
        fieldRef,
        onValidate: function(options?: ValidateOptions){
          if(
            props.novalidate === true || 
            props.disabled === true ||
            preventValidate.value === true ||
            fieldRef.value.disabled
          ) return Promise.resolve()
          return validator.validateField(fieldRef.value, options)
        },
        onValidChange: null
      })
    }
    
    function removeField(key: string){
      validator.removeField(key)
    }

    // 清除验证信息
    function resetValidate(){
      const fields = props.schema.getNeedValidateFields()
      validator.resetValidate(fields)
    }

    provide(XFORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<XFormBuilderContext>(XFORM_CONTEXT_PROVIDE_KEY, {
      type: 'builder',
      registerField, 
      removeField, 
      onUpdateValue,
      renderField: renderField.bind(null, instance.proxy),
    })

    return {
      // 验证整个表单
      validate(){
        if(pending.value) return Promise.reject('[xform error]: validate pending...')
        
        pending.value = true
        return validator.validateSchema(props.schema).then(result => {
          pending.value = false
          return result
        })
      },
      // 重置表单验证
      resetValidate,
      reset(){
        preventValidate.value = true
        resetValidate()
        nextTick(() => preventValidate.value = false)
      },
      onUpdateValue,
      registerField,
      removeField
    }
  },
  render(instance: XFormBuilderInstance){
    const slots = instance.$slots as Slots
    const schema = instance.schema
    const tagName = (isString(instance.tag) ? instance.tag : 'form').toLowerCase()

    const props = { ...instance.$attrs } as RawProps
    if(tagName == 'form') props.novalidate = true

    const klass = normalizeClass(props.class)
    klass['xform-builder'] = true
    props.class = klass

    if(tagName == 'form'){
      props.onSubmit = (event: Event) => {
        event.preventDefault()
        instance.$emit(EVENTS.SUBMIT, instance.validate)
      }

      props.onReset = (event: Event) => {
        event.preventDefault()
        instance.reset()
      }
    }
        
    return (
      <tagName {...props}>
        {isFunction(slots.header) && slots.header()}
        {schema.fields.map(field => renderField(instance, field))}
        {isFunction(slots.default) ? slots.default() : null}
        {isFunction(slots.footer) && slots.footer()}
      </tagName>
    )
  }
})