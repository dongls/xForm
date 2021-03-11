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
  provide,
  onMounted,
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

type XFormItemProps = {
  field: XField;
  validation: boolean | ValidateFunc;
  label: string | boolean;
  virtual: boolean;
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

function renderContent(slots: Slots, field: XField, context: XFormRenderContext){
  if(isFunction(slots.default)) return slots.default({ field })

  const component = getFieldComponent(field, EnumComponent.BUILD)
  if(null == component) return null

  const allProps = { field: field } as RawProps

  if(isBuilderContext(context)){
    allProps.value = field.value
    allProps['onUpdate:value'] = context.onUpdateValue
  }

  return createVNode(component, fillComponentProps(component, allProps, {}))
}

function normalizeField(props: XFormItemProps): ComputedRef<XField>{
  if(props.virtual !== true) return computed(() => props.field)

  // 为保证视图更新和数据格式一致性，这里使用reactive包裹虚拟字段
  const virtualField = reactive(new XField()) as XField
  return computed(() => {
    virtualField.type = props.type
    virtualField.name = props.name
    virtualField.title = props.title
    return virtualField
  })
}

enum EnumComponentName {
  EXTERNAL = 'xform-item',
  INTERNAL = 'xform-item-internal'
}

const XFORM_ITEM_EXTERNAL_PROVIDE_KEY = Symbol.for('@@xform.item.external.provide@@')

function createComponent(name: EnumComponentName){
  return defineComponent({
    name,
    props: {
      field: {
        type: XField,
        default: null
      },
      validation: {
        type: [Boolean, Function],
        default: false
      },
      label: {
        type: [String, Boolean],
        default: null
      },
      /** 
       * 默认情况下，组件会使用`props.field`作为字段数据的来源
       * 如果该字段值为`true`，组件会采用以下行为：
       * - `props.field`失效
       * - 组件创建一个虚拟字段，经由`slot`供组件外使用
       * - 虚拟字段的值来自下方定义的`prop`
       */
      virtual: {
        type: Boolean,
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
    setup(props: XFormItemProps, { slots }){
      const schema = inject<Ref<XFormSchema>>(XFORM_FORM_SCHEMA_PROVIDE_KEY, null)
      const context = inject<XFormRenderContext>(XFORM_CONTEXT_PROVIDE_KEY, null)
      const fieldRef = normalizeField(props)
      
      if(isBuilderContext(context)){
        // 组件为外部组件或者为外部组件的子组件
        const isExternal = name == EnumComponentName.EXTERNAL || inject(XFORM_ITEM_EXTERNAL_PROVIDE_KEY, false)
        if(name === EnumComponentName.EXTERNAL){
          provide(XFORM_ITEM_EXTERNAL_PROVIDE_KEY, true)
        }

        fieldRef.value.validation.external = () => props.validation
        context.registerField(fieldRef, isExternal)

        onBeforeUnmount(() => {
          context.removeField(fieldRef.value.name)
        })
      }
      
      onMounted(() => {
        fieldRef.value.mounted = true
      })
      onBeforeUnmount(() => {
        fieldRef.value.mounted = false
      })

      return function(){
        const field = fieldRef.value
  
        // 字段完全自定义时, 只显示用户自定义的内容
        if(field?.conf?.custom === true) {
          return renderContent(slots, field, context)
        }
  
        const label = props.label === false ? false : props.label || field.title
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
            {
              label ===  false 
                ? null
                : (
                  <label class="xform-item-label" for={field.uid}>
                    <span class="xform-item-title">{label}</span>
                    {renderLabelSuffix(labelSuffix)}
                  </label>
                )
            }
            <div class="xform-item-content">
              {renderContent(slots, field, context)}
              {renderMessage(field)}       
            </div>
          </div>
        )
      }
    }
  })
}

export const XFormItemInternal = createComponent(EnumComponentName.INTERNAL)
export default createComponent(EnumComponentName.EXTERNAL)