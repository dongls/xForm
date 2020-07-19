import { 
  defineComponent, 
  provide,
  ref,
  h,
  Slots,
  resolveComponent,
  VNode,
  ComponentPublicInstance,
  ComponentOptions
} from 'vue'

import {
  EVENT_XFORM_FIELD_ADD,
  EVENT_XFORM_FIELD_REMOVE
} from '@core/util/event'

import { 
  FieldAddEventDetail, 
  FieldEventDetail, 
  XFormModel,
  XFormSchema,
  XField,
  WrappedValidator
} from '@core/model'

import {
  genEventName,
  getFieldComponent
} from '@core/util/component'

import {
  XFORM_MODEL_SYMBOL,
  XFORM_FORM_SCHEMA_SYMBOL
} from '@core/model/constant'
import { ComponentEnum } from '@core/model/XFieldConf'

interface XFormBuilderProps{
  mode: string;
  schema: XFormSchema;
  value: XFormModel;
  tag: string;
}

interface XFormBuilderSetupState{
  update: Function;
  onFieldAdd: (event: CustomEvent) => void;
  onFieldRemove: (event: CustomEvent) => void;
}

type XFormBuilderInstance = ComponentPublicInstance & XFormBuilderProps & XFormBuilderSetupState;

/**
 * 根据字段创建对应的组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`name_[name]`的slot
 * 2. 检索是否有名为`type_[type]`的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderField(field: XField, value: any, slots: Slots, instance: XFormBuilderInstance){
  const fc = field.findFieldConf()
  const component = getFieldComponent(field, ComponentEnum.BUILD, instance.mode)
  if(fc.custom && null != component) return h(component, { field, value })

  const XFormItem = resolveComponent('xform-item') as ComponentOptions
  const itemProps = { key: field.name, field, validation: true }

  return h(XFormItem, itemProps, function(){
    const props = {
      field: field,
      value: value[field.name],
      'onUpdate:value': instance.update
    }

    const nameSlotFunc = slots[`name_${field.name}`]
    const nameSlot: VNode[] = typeof nameSlotFunc == 'function' && nameSlotFunc(props)
    if(nameSlot.length > 0) return nameSlot

    const typeSlotFunc = slots[`type_${field.type}`]
    const typeSlot: VNode[] = typeof typeSlotFunc == 'function' && typeSlotFunc(props)
    if(typeSlot.length > 0) return typeSlot
      
    if(fc == null || fc.build == null) {
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
  setup(props: XFormBuilderProps, { emit }){
    const pending = ref(false)
    const validators = new Map<string, WrappedValidator>()

    provide(XFORM_MODEL_SYMBOL, props.value)
    provide(XFORM_FORM_SCHEMA_SYMBOL, props.schema)

    return {
      async validate(){
        if(pending.value) return Promise.reject('[xform error]: validate pending...')
        
        pending.value = true
        const promises = [...validators.values()].map(fn => fn())
        const messages = await Promise.all(promises)
        pending.value = false
        
        return { messages, valid: messages.every(i => i === true) }
      },
      update(event: any){
        const model = props.value
        const { value, name } = event

        model[name] = value

        emit('update:value', model)
        emit('change', event)
      },
      onFieldAdd(event: CustomEvent){
        event.stopPropagation()

        const { validator, key } = event.detail as FieldAddEventDetail
        if(typeof validator == 'function') validators.set(key, validator)
      },
      onFieldRemove(event: CustomEvent){
        event.stopPropagation()

        const { key } = event.detail as FieldEventDetail
        validators.delete(key)
      }
    }
  },
  render(instance: XFormBuilderInstance){
    const slots: Slots = instance.$slots
    const schema: XFormSchema = instance.schema
    const value = instance.value
    
    const tagName = instance.tag || 'div'
    const props: any = { 
      className: 'xform-builder', 
      [genEventName(EVENT_XFORM_FIELD_ADD)]: instance.onFieldAdd,
      [genEventName(EVENT_XFORM_FIELD_REMOVE)]: instance.onFieldRemove,
    }

    const main = (
      <div class="xform-builder-main">
        {typeof slots.header == 'function' &&  slots.header()}
        {schema.fields.map(field => renderField(field, value, slots, instance))}
        {typeof slots.footer == 'function' && slots.footer()}
      </div>
    ) as VNode
        
    return h(tagName, props, main)
  }
})