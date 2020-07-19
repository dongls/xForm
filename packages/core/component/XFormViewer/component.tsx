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
  XFormSchema
} from '@core/model'

import { 
  XFORM_FORM_SCHEMA_SYMBOL 
} from '@core/model/constant'

import { isEmpty } from '@core/util/lang'
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
function renderField(field: XField, instance: XFormViewerInstance){
  const component = getFieldComponent(field, ComponentEnum.VIEW, instance.mode)
  const fc = field.findFieldConf()
  const props = {
    field: field,
    value: instance.formatter(field),
    model: instance.model
  }

  if(fc.custom && component != null) return h(component, props)

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

    return null == component ? instance.formatter(field): h(component, props)
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
      const placeholder = props.schema.viewerPlaceholder || ''

      return isEmpty(value) ? placeholder  : value
    }

    provide(XFORM_FORM_SCHEMA_SYMBOL, props.schema)

    return {
      formatter
    }
  },
  render(instance: XFormViewerInstance){
    const schema: XFormSchema = instance.schema

    return (
      <div class="xform-viewer">
        <div class="xform-viewer-main">
          {schema.fields.map(field => renderField(field, instance))}
        </div>
      </div>
    )
  }
})