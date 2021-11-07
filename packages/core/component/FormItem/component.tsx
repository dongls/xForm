import { 
  ComputedRef,
  Ref,
  Slots,
  computed,
  createVNode,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  useSlots,
  ComponentOptions,
} from 'vue'

import { 
  CLASS,
  EnumComponent,
  LabelPosition,
  EnumValidityState,
  RawProps,
  ValidateFunc,
  XFORM_CONTEXT_PROVIDE_KEY,
  XFORM_ITEM_EXTERNAL_PROVIDE_KEY,
  XFORM_SCHEMA_PROVIDE_KEY,
  FormField, 
  FormBuilderContext,
  FormRenderContext,
  FormSchema,
  AnyProps,
} from '../../model'

import { 
  fillComponentProps,
  getFieldComponent,
  isFunction,
} from '../../util'

type Props = {
  field: FormField;
  validation: boolean | ValidateFunc;
  label: string | boolean;
  custom: boolean;
  virtual: boolean;
  title: string;
  name: string;
  type: string;
  disabled: boolean;
  required: boolean;
}

enum EnumComponentName {
  EXTERNAL = 'xform-item',
  INTERNAL = 'xform-item-internal'
}

function isBuilderContext(context: FormRenderContext): context is FormBuilderContext {
  return null != context && context.type == 'builder'
}

function renderLabelSuffix(suffix: string){
  if(!suffix) return null

  return <span>{suffix}</span>
}

function renderMessage(field: FormField){
  const { message, validating } = field.validation
  if(validating) return <p class="xform-is-validating">验证中...</p>
  if(message) return <p class="xform-item-message">{message}</p>
  return null
}

function renderContent(slots: Slots, field: FormField, context: FormRenderContext, disabled: boolean){
  if(isFunction(slots.default)) return slots.default({ field, disabled })

  const component = getFieldComponent(field, EnumComponent.BUILD)
  if(null == component) return null

  const allProps = { field: field, disabled } as RawProps

  return createVNode(component, fillComponentProps(component, allProps, {}))
}

function normalizeField(props: Props): ComputedRef<FormField>{
  if(props.virtual !== true) return computed(() => props.field)

  // 为保证视图更新和数据格式一致性，这里使用reactive包裹虚拟字段
  const virtualField = reactive(new FormField()) as FormField
  return computed(() => {
    virtualField.type = props.type
    virtualField.name = props.name
    virtualField.title = props.title
    virtualField.required = props.required === true
    return virtualField
  })
}

function createComponent(name: EnumComponentName): ComponentOptions{
  return {
    name,
    props: {
      field: {
        type: FormField,
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
      custom: {
        type: Boolean,
        default: false
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
      },
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    setup(props: Props){
      const slots = useSlots()
      const schema = inject<Ref<FormSchema>>(XFORM_SCHEMA_PROVIDE_KEY, null)
      const context = inject<FormRenderContext>(XFORM_CONTEXT_PROVIDE_KEY, null)
      const fieldRef = normalizeField(props)
      
      // 组件为外部组件或者为外部组件的子组件
      const isExternal = name == EnumComponentName.EXTERNAL || inject(XFORM_ITEM_EXTERNAL_PROVIDE_KEY, false)
      if(name === EnumComponentName.EXTERNAL) provide(XFORM_ITEM_EXTERNAL_PROVIDE_KEY, true)
      if(isExternal && schema != null) schema.value.registerExternalField(fieldRef.value)
      if(isBuilderContext(context)) fieldRef.value.validation.external = () => props.validation
      
      onMounted(() => {
        fieldRef.value.state.mounted = true
      })

      onBeforeUnmount(() => {
        fieldRef.value.state.mounted = false
      })

      return function(){
        const field = fieldRef.value
  
        // 字段完全自定义时, 只显示用户自定义的内容
        if(props.custom || field?.conf?.custom === true) {
          return renderContent(slots, field, context, props.disabled)
        }
  
        const label = props.label === false ? false : props.label || field.title
        const labelPosition = schema?.value?.labelPosition ?? LabelPosition.LEFT
        const labelSuffix = schema?.value?.labelSuffix
        const required = (
          isBuilderContext(context) && props.validation === false || props.disabled || field.disabled 
            ? false
            : field.required
        )

        const _props = {
          'class': {
            'xform-item': true,
            [`xform-is-${labelPosition}`]: true,
            'xform-is-required': required,
            'xform-is-exteranl': isExternal,
            [CLASS.IS_ERROR]: field.validation.valid == EnumValidityState.ERROR
          }
        } as AnyProps

        if(__IS_TEST__ === true){
          _props.name = field.name
        }
        
        return (
          <div {..._props}>
            {
              label === false 
                ? null
                : (
                  <label class="xform-item-label" for={field.uid}>
                    <span class="xform-item-title">{label}</span>
                    {renderLabelSuffix(labelSuffix)}
                  </label>
                )
            }
            <div class="xform-item-content">
              {renderContent(slots, field, context, props.disabled)}
              {renderMessage(field)}       
            </div>
          </div>
        )
      }
    }
  }
}

export const FormItemInternal = createComponent(EnumComponentName.INTERNAL)
export default createComponent(EnumComponentName.EXTERNAL)