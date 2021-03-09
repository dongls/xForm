import { 
  ComputedRef,
  Ref,
  Slots,
  computed,
  createVNode,
  defineComponent, 
  inject,
  onBeforeUnmount,
  reactive,
  toRef,
} from 'vue'

import { 
  EnumComponent,
  EnumLabelPosition,
  EnumValidityState,
  ValidateFunc,
  XFORM_CONTEXT_PROVIDE_KEY,
  XFORM_FORM_SCHEMA_PROVIDE_KEY,
  XField, 
  XFormBuilderContext,
  XFormModel,
  XFormSchema,
  CLASS,
  RawProps,
  XFormRenderContext,
} from '../../model'

import { 
  isFunction,
  getFieldComponent,
  fillComponentProps,
} from '../../util'

import { useModel } from '../../api'

type XFormItemProps = {
  field: XField;
  validation: boolean | ValidateFunc;
  title: string;
  type: string;
  name: string;
}

function isBuilderContext(context: XFormRenderContext): context is XFormBuilderContext {
  return null != context && context.type == 'builder'
}

function renderLabelSuffix(suffix: string){
  if(!suffix) return null

  return <span>{suffix}</span>
}

function renderMessage(field: XField){
  const { message, validating } = field.validation
  if(validating) return <p class="xform-is-validating">验证中...</p>
  if(message) return <p class="xform-item-message">{message}</p>
  return null
}

function renderContent(slots: Slots, field: XField, model: XFormModel, context: XFormRenderContext){
  if(isFunction(slots.default)) return slots.default()

  const component = getFieldComponent(field, EnumComponent.BUILD)
  if(null == component) return null

  const allProps = { field: field } as RawProps

  if(isBuilderContext(context)){
    allProps.value = model[field.name]
    allProps['onUpdate:value'] = context.updateFieldValue
  }

  return createVNode(component, fillComponentProps(component, allProps, {}))
}

function patchField(field: XField, o: any){
  field.type = o.type
  field.name = o.name
  field.title = o.title

  field.required = 'required' in o && o.required !== false
}

function normalizeField(props: XFormItemProps, attrs: any): ComputedRef<XField>{
  if(null != props.field) return computed(() => props.field)

  // 为保证视图更新和数据格式一致性，这里使用reactive包裹虚拟字段
  const virtualField = reactive(new XField()) as XField
  return computed(() => {
    patchField(virtualField, { ...props, ...attrs })
    return virtualField
  })
}

export default defineComponent({
  name: 'xform-item',
  inheritAttrs: false,
  props: {
    field: {
      type: XField,
      default: null
    },
    validation: {
      type: [Boolean, Function],
      default: false
    },
    title: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  setup(props: XFormItemProps, { slots, attrs }){
    const schema = inject<Ref<XFormSchema>>(XFORM_FORM_SCHEMA_PROVIDE_KEY, null)
    const context = inject<XFormRenderContext>(XFORM_CONTEXT_PROVIDE_KEY, null)

    const fieldRef = normalizeField(props, attrs)
    const model = useModel()

    if(isBuilderContext(context)){
      context.registerField(fieldRef, toRef(props, 'validation'))
      onBeforeUnmount(() => {
        context.removeField(fieldRef.value.name)
      })
    }
    
    return function(){
      const field = fieldRef.value

      // 字段完全自定义时, 只显示用户自定义的内容
      if(field?.conf?.custom === true) {
        return renderContent(slots, field, model, context)
      }

      const labelPosition = schema?.value?.labelPosition ?? EnumLabelPosition.LEFT
      const labelSuffix = schema?.value?.labelSuffix

      const className =  {
        'xform-item': true,
        [`xform-is-${labelPosition}`]: true,
        'xform-is-required': isBuilderContext(context) ? !context.novalidate.value && field.required : field.required, 
        [CLASS.IS_ERROR]: field.validation.valid == EnumValidityState.ERROR
      }
      
      return (
        <div class={className}>
          <label class="xform-item-label" for={field.name}>
            <span class="xform-item-title">{field.title}</span>
            {renderLabelSuffix(labelSuffix)}
          </label>
          <div class="xform-item-content">
            {renderContent(slots, field, model, context)}
            {renderMessage(field)}       
          </div>
        </div>
      )
    }
  }
})