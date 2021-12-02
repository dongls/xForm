import { 
  createVNode,
  defineComponent, 
  getCurrentInstance,
  h,
  provide,
  ref,
  toRef,
  nextTick,
  onBeforeUnmount,
  computed,
  Ref,
  ComponentInternalInstance,
} from 'vue'

import { 
  EnumComponent,
  RawProps,
  RenderOptions,
  XFORM_CONTEXT_PROVIDE_KEY, 
  XFORM_SCHEMA_PROVIDE_KEY,
  FormField,
  FormBuilderContext,
  FormSchema,
  EVENTS,
  EnumRenderType,
} from '../../model'

import {
  fillComponentProps,
  getFieldComponent,
  isFunction,
  isNull,
  isString,
} from '../../util'

import { useValidator } from '../../validator'
import { FormItemInternal } from '../FormItem/component'
import { test } from '../../logic'
import { getConfig } from '../../api'

interface Props{
  mode: string;
  schema: FormSchema;
  tag: string;
  novalidate: boolean;
  disabled: boolean;
}

function renderUnknown(field: FormField){
  console.warn(`[xform] field not implement build component: ${field.title}(${field.name})`)
  return <p class="xform-is-unknown">暂不支持的字段类型</p>
}

function useRenderContext(instance: ComponentInternalInstance){
  /**
   * 根据字段创建对应的组件，按以下顺序逐次匹配：
   * 1. 检索是否有名为`name_[name]`的slot
   * 2. 检索是否有名为`type_[type]`的slot
   * 3. 检索字段对应的XFieldConf中配置的组件
   */
  function renderContent(field: FormField, options: RenderOptions){
    const slots = instance.slots
    const props = instance.props as any as Props
    const value = field.value
    const disabled = props.disabled || field.disabled || options.parentProps?.disabled === true

    const nameSlot = slots[`name_${field.name}`]
    if(isFunction(nameSlot)) return nameSlot({ field, value, disabled })

    const typeSlot = slots[`type_${field.type}`]
    if(isFunction(typeSlot)) return typeSlot({ field, value, disabled })

    const all = { field, value, disabled }
    const component = getFieldComponent(field, EnumComponent.BUILD, props.mode)
    if(null == component) return null

    const create = isFunction(options.renderContent) ? options.renderContent : createVNode
    return create(component, fillComponentProps(component, all))
  }

  function renderField(field: FormField, options: RenderOptions = {}){
    if(field.hidden === true) return null
  
    if(
      getConfig().logic === true && 
      !isNull(field.logic) && 
      !test(field.logic, field.parent.model, field)
    ) return null

    const props = instance.props as any as Props
    const disabled = props.disabled || field.disabled || options.parentProps?.disabled === true  
    const children = function(){
      return renderContent(field, options) ?? renderUnknown(field)
    }

    return (isFunction(options.renderItem) ? options.renderItem : h)(FormItemInternal, {
      key: field.uid, 
      field, 
      validation: !props.novalidate && !disabled, 
      disabled
    }, children)
  }

  return {
    type: EnumRenderType.BUILDER,
    renderField,
  } as FormBuilderContext
}

export default defineComponent({
  name: 'xform-builder',
  props: {
    mode: {
      type: String,
      default: null
    },
    schema: {
      type: FormSchema,
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
  setup(props: Props, { emit, expose }){
    const instance = getCurrentInstance()
    const rc = useRenderContext(instance)
    const version = ref(1)

    const schemaRef = toRef(props, 'schema') as Ref<FormSchema>
    const pending = ref(false)
    const preventValidate = ref(false)
    const disabledValidate = computed(() => {
      return (
        props.novalidate === true || 
        props.disabled === true ||
        preventValidate.value === true
      )
    })

    const validator = useValidator(schemaRef, disabledValidate)
    const stop = props.schema.useEffect(action => {
      switch (action.type) {
        case 'value.change': {
          emit(EVENTS.VALUE_CHANGE)
          break
        }
      }
    })

    // 清除验证信息
    function resetValidate(){
      const fields = props.schema.getNeedValidateFields()
      validator.resetValidate(fields)
    }

    // 重置表单
    function reset(){
      preventValidate.value = true
      resetValidate()
      nextTick(() => {
        preventValidate.value = false
        version.value++
      })
    }

    // 验证整个表单
    function validate(){
      if(pending.value) return Promise.reject('[xform error]: validate pending...')
      
      pending.value = true
      return validator.validateSchema(props.schema).then(result => {
        pending.value = false
        return result
      })
    }

    function mixinFormProps(p: RawProps){
      p.novalidate = true

      p.onSubmit = (event: Event) => {
        event.preventDefault()
        emit(EVENTS.SUBMIT, validate)
      }

      p.onReset = (event: Event) => {
        event.preventDefault()
        reset()
      }
    }

    provide(XFORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<FormBuilderContext>(XFORM_CONTEXT_PROVIDE_KEY, rc)

    onBeforeUnmount(stop)

    expose({
      reset,
      resetValidate,
      validate,
    })

    return function(){
      const slots = instance.slots
      const schema = props.schema
      const tagName = (isString(props.tag) ? props.tag : 'form').toLowerCase()

      const _p = { 'class': 'xform-builder', 'key': version.value } as RawProps
      if(tagName == 'form') mixinFormProps(_p)
        
      return (
        <tagName {..._p}>
          {isFunction(slots.header) && slots.header()}
          {schema.fields.map(field => rc.renderField(field))}
          {isFunction(slots.default) ? slots.default() : null}
          {isFunction(slots.footer) && slots.footer()}
        </tagName>
      ) 
    }
  }
})