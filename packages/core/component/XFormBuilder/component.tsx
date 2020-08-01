import { 
  defineComponent, 
  provide,
  ref,
  h,
  Slots,
  resolveComponent,
  VNode,
  ComponentPublicInstance,
  ComponentOptions,
  RenderFunction,
  watch
} from 'vue'

import { 
  XFormModel,
  XFormSchema,
  XField,
  XFORM_MODEL_PROVIDE_KEY, 
  XFORM_BUILDER_CONTEXT_PROVIDE_KEY, 
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
  ValidateOptions,
  ComponentEnum,
  WrappedValidator
} from '@core/model'

import {
  getFieldComponent
} from '@core/util/component'

import Store from '@core/store'

interface XFormBuilderProps{
  mode: string;
  schema: XFormSchema;
  value: XFormModel;
  tag: string;
}

interface XFormBuilderSetupState{
  update: Function;
}

type XFormBuilderInstance = ComponentPublicInstance & XFormBuilderProps & XFormBuilderSetupState;

/**
 * 根据字段创建对应的组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`name_[name]`的slot
 * 2. 检索是否有名为`type_[type]`的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderField(instance: XFormBuilderInstance, slots: Slots, value: any, field: XField){
  const component = getFieldComponent(field, ComponentEnum.BUILD, instance.mode)
  if(field.conf?.custom === true && null != component) {
    const props = { field, value: value[field.name] } as any
    if(component && 'renderField' in component.props) {
      props.renderField = renderField.bind(null, instance, slots, value)
    }

    return h(component, props)
  }

  const XFormItem = resolveComponent('xform-item') as ComponentOptions
  const itemProps = { key: field.name, field, validation: true }

  return h(XFormItem, itemProps, function(){
    // 动态props
    const props = {
      field: field,
      value: value[field.name],
      'onUpdate:value': instance.update
    } as any

    if(component && 'renderField' in component.props) {
      props.renderField = renderField.bind(null, instance, slots, value)
    }
    
    const nameSlotFunc = slots[`name_${field.name}`]
    const nameSlot: VNode[] = typeof nameSlotFunc == 'function' && nameSlotFunc(props)
    if(nameSlot.length > 0) return nameSlot

    const typeSlotFunc = slots[`type_${field.type}`]
    const typeSlot: VNode[] = typeof typeSlotFunc == 'function' && typeSlotFunc(props)
    if(typeSlot.length > 0) return typeSlot
    
    if(field.conf == null || field.conf.build == null) {
      console.warn(`field[${field.title}: ${field.name}] not implement build component`)
      return <p class="xform-is-unknown">暂不支持的字段类型</p>
    }

    return h(component, props)
  })
}

export default defineComponent({
  name: 'xform-builder',
  props: {
    mode: {
      type: String,
      default: null
    },
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      default: 'form'
    }
  },
  emits: ['update:value', 'change'],
  setup(props: XFormBuilderProps, { emit }){
    const pending = ref(false)
    const REGISTERED_FIELDS = new Map<string, ValidateOptions>()

    function registerField(key: string, validator: WrappedValidator){
      const stopHandle = watch(() => props.value[key], () => {
        if(Store.getConfig().validation.immediate !== false) validator()
      })

      REGISTERED_FIELDS.set(key, { validator, stopHandle })
    }
    
    function removeField(key: string){
      const o = REGISTERED_FIELDS.get(key)
      if(null != o) {
        REGISTERED_FIELDS.delete(key)
        if(typeof o.stopHandle == 'function') o.stopHandle()
      }
    }

    function update(event: any){
      const model = props.value
      const { value, name } = event

      model[name] = value

      emit('update:value', model)
      emit('change', event)
    }

    provide(XFORM_MODEL_PROVIDE_KEY, props.value)
    provide(XFORM_FORM_SCHEMA_PROVIDE_KEY, props.schema)
    provide(XFORM_BUILDER_CONTEXT_PROVIDE_KEY, { 
      registerField, 
      removeField, 
      updateFieldValue: update
    })

    return {
      async validate(){
        if(pending.value) return Promise.reject('[xform error]: validate pending...')
        
        pending.value = true
        const promises = [...REGISTERED_FIELDS.values()].map(i => i.validator())
        const messages = await Promise.all(promises)
        pending.value = false
        
        return { messages, valid: messages.every(i => i === true) }
      },
      update,
      registerField,
      removeField
    }
  },
  render(instance: XFormBuilderInstance){
    const slots: Slots = instance.$slots
    const schema: XFormSchema = instance.schema
    const value = instance.value
    
    const tagName = instance.tag || 'div'
    const props = { 
      className: 'xform-builder', 
      novalidate: tagName == 'form'
    }
    
    const main = (
      <div class="xform-builder-main">
        {typeof slots.header == 'function' && slots.header()}
        {schema.fields.map(field => renderField(instance, slots, value, field))}
        {typeof slots.default == 'function' && slots.default()}
        {typeof slots.footer == 'function' && slots.footer()}
      </div>
    ) as RenderFunction
        
    return h(tagName, props, main)
  }
})