import { 
  defineComponent,
  provide,
  getCurrentInstance,
  toRef,
  createVNode,
  ComponentInternalInstance,
  PropType
} from 'vue'

import { 
  EnumComponent,
  EnumRenderType,
  FormField,
  FormSchema,
  FormViewerContext,
  Formatter,
  RenderOptions,
  XFORM_CONTEXT_PROVIDE_KEY,
  XFORM_SCHEMA_PROVIDE_KEY,
} from '../../model'

import { 
  fillComponentProps,
  getFieldComponent,
  isFunction
} from '../../util'

import { getConfig } from '../../api'
import { FormItemInternal } from '../FormItem/component'

function useRenderContext(instance: ComponentInternalInstance, formatter: Formatter){
  /**
   * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
   * 1. 检索是否有名为`name_[name]`对应的slot
   * 2. 检索是否有名为`type_[type]`对应的slot
   * 3. 检索字段对应的XFieldConf中配置的组件
   */
  function renderContent(field: FormField, value: any, options: RenderOptions){
    const slots = instance.slots
    const disabled = field.disabled || options.parentProps?.disabled === true
  
    const nameSlot = slots[`name_${field.name}`]
    if(isFunction(nameSlot)) return nameSlot({ field, value, disabled })
  
    const typeSlot = slots[`type_${field.type}`]
    if(isFunction(typeSlot)) return typeSlot({ field, value, disabled })
    const component = getFieldComponent(field, EnumComponent.VIEW, (instance.props as any).mode)
    if(component == null) return null
  
    const props = fillComponentProps(component, { field, value, disabled })
    const create = isFunction(options?.renderContent) ? options.renderContent : createVNode
    return create(component, props)
  }
  
  function renderField(field: FormField, options: RenderOptions = {}){
    if(field.hidden === true) return null

    const disabled = options.parentProps?.disabled === true || field.disabled
    const value = formatter(field, instance.props)
    const props = { key: field.name, field, validation: false, disabled }
    const children = function(){
      return renderContent(field, value, options) ?? <span class="xform-viewer-value">{value}</span>
    }

    const create = isFunction(options?.renderItem) ? options.renderItem : createVNode
    return create(FormItemInternal, props, children)
  }

  return {
    type: EnumRenderType.VIEWER,
    renderField,
    formatter
  } as FormViewerContext
}

export default defineComponent({
  name: 'xform-viewer',
  props: {
    schema: {
      type: FormSchema,
      required: true
    },
    mode: {
      type: String,
      default: null
    },
    formatter: {
      type: Function as PropType<Formatter>,
      default: null
    }
  },
  setup(props, { expose }){
    function formatter(field: FormField){
      const fmt = isFunction(props.formatter) ? props.formatter : getConfig().formatter
      return fmt(field, props)
    }

    const instance = getCurrentInstance()
    const context = useRenderContext(instance, formatter)

    provide(XFORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<FormViewerContext>(XFORM_CONTEXT_PROVIDE_KEY, context)

    expose({ formatter })

    return function(){
      const slots = instance.slots
      const schema = props.schema

      return (
        <div class="xform-viewer">
          {typeof slots.header == 'function' && slots.header()}
          {schema.fields.map(field => context.renderField(field))}
          {typeof slots.default == 'function' && slots.default()}
          {typeof slots.footer == 'function' && slots.footer()}
        </div>
      )
    }
  }
})