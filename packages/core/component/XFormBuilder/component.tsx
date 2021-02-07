import Store from '@core/store'

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
  ComputedRef,
  nextTick,
  toRef,
  createVNode,
} from 'vue'

import { 
  XFormModel,
  XFormSchema,
  XField,
  ValidateOptions,
  WrappedValidator,
  ComponentEnum,
  XFORM_MODEL_PROVIDE_KEY, 
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
  XFormBuilderContext,
  PatchProps,
} from '@model'

import { fillComponentProps, getFieldComponent } from '@core/util/component'
import { isFunction, isString } from '@core/util/lang'
import { disableValidate, enableValidate } from '@core/api'

interface XFormBuilderProps{
  mode: string;
  schema: XFormSchema;
  model: XFormModel;
  tag: string;
}

interface XFormBuilderSetupState{
  update: Function;
}

type XFormBuilderInstance = ComponentPublicInstance & XFormBuilderProps & XFormBuilderSetupState;

const EVENTS = {
  CHANGE: 'change',
  UPDATE_MODEL: 'update:model'
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
  const component = getFieldComponent(field, ComponentEnum.BUILD, instance.mode)
  if(null == component) return null

  const props = fillComponentProps(component, all)
  return createVNode(component, isFunction(patch) ? patch(props) : props)
}

function renderField(instance: XFormBuilderInstance, field: XField, patch?: PatchProps){
  const content = renderContent(instance, field, patch)
  // 字段完全自定义时不使用xform-item包裹
  if(field.conf?.custom === true) return content

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
    }
  },
  emits: [EVENTS.CHANGE, EVENTS.UPDATE_MODEL],
  setup(props: XFormBuilderProps, { emit }){
    const instance = getCurrentInstance()
    const pending = ref(false)
    const REGISTERED_FIELDS = new Map<string, ValidateOptions>()

    function registerField(fieldRef: ComputedRef<XField>, validator: WrappedValidator){
      const key = fieldRef.value.name
      const stopHandle = watch(() => props.model[key], () => {
        Store.isEnableValidate() && Store.isImmediateValidate() && validator()
      })

      REGISTERED_FIELDS.set(key, { fieldRef, validator, stopHandle })
    }
    
    function removeField(key: string){
      const o = REGISTERED_FIELDS.get(key)
      if(null != o) {
        REGISTERED_FIELDS.delete(key)
        isFunction(o.stopHandle) && o.stopHandle()
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
      for(const option of REGISTERED_FIELDS.values()){
        const field = option.fieldRef.value
        field && field.resetValidate()
      }
    }

    provide(XFORM_MODEL_PROVIDE_KEY, toRef(props, 'model'))
    provide(XFORM_FORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<XFormBuilderContext>(XFORM_CONTEXT_PROVIDE_KEY, {
      type: 'builder',
      registerField, 
      removeField, 
      updateFieldValue: update,
      renderField: renderField.bind(null, instance.proxy)
    })

    return {
      // 验证整个表单
      async validate(){
        if(pending.value) return Promise.reject('[xform error]: validate pending...')
        
        pending.value = true
        const promises = [...REGISTERED_FIELDS.values()].map(i => i.validator())
        const messages = await Promise.all(promises)
        pending.value = false
        
        return { messages, valid: messages.every(i => i === true) }
      },
      // 验证单个字段
      validateField(...args: string[]){
        const names = args.flat()
        if(names.length == 0) return

        for(const name of names){
          const r = REGISTERED_FIELDS.get(name)
          r && r.validator()
        }
      },
      // 重置表单验证
      resetValidate,
      // 重置表单
      reset(){
        disableValidate()
        emit(EVENTS.UPDATE_MODEL, {})
        resetValidate()
        nextTick(enableValidate)
      },
      update,
      registerField,
      removeField
    }
  },
  render(instance: XFormBuilderInstance){
    const slots: Slots = instance.$slots
    const schema: XFormSchema = instance.schema
    const tagName = (isString(instance.tag) ? instance.tag : 'form').toLowerCase()
    // 考虑到异步验证时需要处理与表单相关的交互，这里暂不处理submit事件
    const props = { 
      className: 'xform-builder', 
      novalidate: tagName == 'form'
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