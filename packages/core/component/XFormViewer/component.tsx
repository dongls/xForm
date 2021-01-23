import { 
  defineComponent,
  provide, 
  h,
  resolveComponent,
  ComponentPublicInstance,
  getCurrentInstance
} from 'vue'

import { 
  XField, 
  XFormModel, 
  XFormSchema,
  ComponentEnum,
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
  RawProps,
  XFORM_CONTEXT_PROVIDE_KEY,
  XFormViewerContext
} from '@core/model'

import { isFunction } from '@core/util/lang'
import { getFieldComponent } from '@core/util/component'
import Store from '@core/store'

interface XFormViewerProps{
  schema: XFormSchema;
  model: XFormModel;
  mode: string;
}

interface XFormViewerSetupState{
  formatter: Function;
  [prop: string]: any;
}

type XFormViewerInstance = ComponentPublicInstance & XFormViewerProps & XFormViewerSetupState;

/**
 * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`name_[name]`对应的slot
 * 2. 检索是否有名为`type_[type]`对应的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderContent(instance: XFormViewerInstance, props: RawProps, field: XField){
  const slots = instance.$slots

  const nameSlot = slots[`name_${field.name}`]
  if(isFunction(nameSlot)) return nameSlot(props)

  const typeSlot = slots[`type_${field.type}`]
  if(isFunction(typeSlot)) return typeSlot(props)

  const component = getFieldComponent(field, ComponentEnum.VIEW, instance.mode)
  return null == component ? null : h(component, props)
}

function renderField(instance: XFormViewerInstance, field: XField){
  const conf = Store.getConfig()
  const value = conf.formatter(field, instance.$props, instance)

  const props = { field, value, model: instance.model }
  const content = renderContent(instance, props, field)

  if(field.conf?.custom === true) return content

  const XFormItem = resolveComponent('xform-item')
  const itemProps = { key: field.name, field, validation: false }
  return h(XFormItem, itemProps, function(){
    return content ?? value
  })
}

export default defineComponent({
  name: 'xform-viewer',
  props: {
    schema: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: null
    }
  },
  setup(props: XFormViewerInstance){
    const instance = getCurrentInstance()

    provide<XFormSchema>(XFORM_FORM_SCHEMA_PROVIDE_KEY, props.schema)
    provide<XFormViewerContext>(XFORM_CONTEXT_PROVIDE_KEY, {
      type: 'viewer',
      renderField: renderField.bind(null, instance.proxy)
    })

    return {}
  },
  render(instance: XFormViewerInstance){
    const schema: XFormSchema = instance.schema
    const slots = instance.$slots

    return (
      <div class="xform-viewer">
        <div class="xform-viewer-main">
          {typeof slots.header == 'function' && slots.header()}
          {schema.fields.map(field => renderField(instance, field))}
          {typeof slots.default == 'function' && slots.default()}
          {typeof slots.footer == 'function' && slots.footer()}
        </div>
      </div>
    )
  }
})