import { 
  defineComponent,
  provide,
  ComponentPublicInstance,
  getCurrentInstance,
  toRef,
  createVNode
} from 'vue'

import { 
  EnumComponent,
  XFORM_CONTEXT_PROVIDE_KEY,
  XFORM_SCHEMA_PROVIDE_KEY,
  FormField, 
  FormSchema,
  FormViewerContext,
  RenderOptions,
} from '../../model'

import { 
  fillComponentProps,
  getFieldComponent,
  isFunction
} from '../../util'

import { XFormItemInternal } from '../XFormItem/component'

import Store from '../../store'

interface XFormViewerProps{
  schema: FormSchema;
  mode: string;
  formatter: Function;
}

interface XFormViewerSetupState{
  fmtValue: Function;
}

type XFormViewerInstance = ComponentPublicInstance & XFormViewerProps & XFormViewerSetupState;

/**
 * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`name_[name]`对应的slot
 * 2. 检索是否有名为`type_[type]`对应的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderContent(instance: XFormViewerInstance, field: FormField, value: any, options: RenderOptions){
  const slots = instance.$slots
  const disabled = field.disabled || options.parentProps?.disabled === true

  const nameSlot = slots[`name_${field.name}`]
  if(isFunction(nameSlot)) return nameSlot({ field, value, disabled })

  const typeSlot = slots[`type_${field.type}`]
  if(isFunction(typeSlot)) return typeSlot({ field, value, disabled })
  const component = getFieldComponent(field, EnumComponent.VIEW, instance.mode)
  if(component == null) return null

  const props = fillComponentProps(component, { field, value, disabled })
  const create = isFunction(options?.renderContent) ? options.renderContent : createVNode
  return create(component, props)
}

function renderField(instance: XFormViewerInstance, field: FormField, options: RenderOptions = {}){
  if(field.hidden === true) return null

  const disabled = options.parentProps?.disabled === true || field.disabled
  const value = instance.fmtValue(field, instance.$props, instance)
  const props = { key: field.name, field, validation: false, disabled }
  const children = function(){
    return renderContent(instance, field, value, options) ?? <span class="xform-viewer-value">{value}</span>
  }

  const create = isFunction(options?.renderItem) ? options.renderItem : createVNode
  return create(XFormItemInternal, props, children)
}

export default defineComponent({
  name: 'xform-viewer',
  props: {
    schema: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: null
    },
    formatter: {
      type: Function,
      default: null
    }
  },
  setup(props: XFormViewerInstance){
    const instance = getCurrentInstance()
  
    function fmtValue(field: FormField){
      const fmt = props.formatter ?? Store.getConfig().formatter
      return fmt(field, props, instance.proxy)
    }

    provide(XFORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<FormViewerContext>(XFORM_CONTEXT_PROVIDE_KEY, {
      type: 'viewer',
      renderField: renderField.bind(null, instance.proxy),
      formatter: fmtValue
    })

    return { fmtValue }
  },
  render(instance: XFormViewerInstance){
    const schema: FormSchema = instance.schema
    const slots = instance.$slots

    return (
      <div class="xform-viewer">
        {typeof slots.header == 'function' && slots.header()}
        {schema.fields.map(field => renderField(instance, field))}
        {typeof slots.default == 'function' && slots.default()}
        {typeof slots.footer == 'function' && slots.footer()}
      </div>
    )
  }
})