import { 
  defineComponent,
  provide, 
  h,
  resolveComponent,
  ComponentPublicInstance,
  ComponentOptions,
  VNode
} from 'vue'

import { 
  XField, 
  XFormModel, 
  XFormSchema,
  AnyProps
} from '@core/model'

import { 
  XFORM_FORM_SCHEMA_PROVIDE_KEY
} from '@core/model/constant'

import { isEmpty, isNull } from '@core/util/lang'
import { getFieldComponent } from '@core/util/component'
import { ComponentEnum } from '@core/model/XFieldConf'

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
function renderField(instance: XFormViewerInstance, field: XField){
  const component = getFieldComponent(field, ComponentEnum.VIEW, instance.mode)
  const props = {
    field: field,
    value: instance.formatter(field),
    model: instance.model
  } as AnyProps

  if(component && 'renderField' in component.props) props.renderField = renderField.bind(null, instance)
  if(field.conf?.custom === true && component != null) return h(component, props)

  const XFormItem = resolveComponent('xform-item') as ComponentOptions
  const itemProps = { key: field.name, field }

  return h(XFormItem, itemProps, function(){
    const slots = instance.$slots

    const nameSlotFunc = slots[`name_${field.name}`]
    const nameSlot: VNode[] = typeof nameSlotFunc == 'function' && nameSlotFunc(props)
    if(nameSlot.length > 0) return nameSlot

    const typeSlotFunc = slots[`type_${field.type}`]
    const typeSlot: VNode[] = typeof typeSlotFunc == 'function' && typeSlotFunc(props)
    if(typeSlot.length > 0) return typeSlot

    return null == component ? instance.formatter(field) : h(component, props)
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
    function formatter(field: XField){
      const model = props.model
      const value = model[field.name]

      if(isNull(value) || isEmpty(value)) return props.schema.viewerPlaceholder ?? ''
      return Array.isArray(value) ? value.join('，') : value
    }

    provide(XFORM_FORM_SCHEMA_PROVIDE_KEY, props.schema)

    return {
      formatter
    }
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