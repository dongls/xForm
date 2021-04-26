import { defineComponent, ref } from 'vue'

import { 
  FormField,
  FieldConf, 
  constant,
  useRenderContext,
} from '@dongls/xform'

import icon from '@common/svg/group.svg'
import setting from './setting.vue'

const { SELECTOR, CLASS, EnumBehavior, PROPS, EnumValidateMode, EnumValidityState } = constant
const GROUP_LIST_CLASS = 'xform-bs-group-list'
const GROUP_LIST_SELECTOR = `.${GROUP_LIST_CLASS}`

type GroupValue = { [prop: string]: FormField }

function useHeader(){
  const collasped = ref(false)

  function toggle(){
    collasped.value = !collasped.value
  }

  function renderHeader(field: FormField){
    if(null == field.title) return null
  
    const btn = (
      field.attributes.collapsable === true
        ? (
          <button 
            type="button" 
            title={collasped.value ? '展开' : '收起'} 
            class="btn btn-link xform-bs-group-toggle" 
            onClick={toggle} 
          >{collasped.value ? '展开' : '收起'}</button>
        )
        : null
    )
  
    return <h6 class="card-header"><span>{ field.title }</span>{ btn }</h6>
  }

  return { collasped, renderHeader }
}

const build = defineComponent({
  name: 'xform-bs-group',
  props: {
    field: {
      type: FormField,
      required: true
    },
    behavior: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props){
    const { collasped, renderHeader } = useHeader()
    const { renderField } = useRenderContext()

    return function(){
      const value = props.field.value
      const fields = props.field.fields
      const inDesigner = props.behavior == EnumBehavior.DESIGNER
      const message = props.field.validation.message
      const disabled = props.disabled

      const className = {
        'xform-item': true,
        'xform-bs-group': true,
        'xform-is-collasped': collasped.value,
        [CLASS.IS_ERROR]: props.field.validation.valid == EnumValidityState.ERROR
      }

      const tip = (
        inDesigner && fields.length == 0 
          ? <p class={[CLASS.IS_EMPTY_TIP, 'xform-bs-empty-tip']}>请将左侧控件拖动到此处</p>
          : null
      )

      const bodyProps = {
        class: {
          'card-body': true, 
          [GROUP_LIST_CLASS]: true,
          [CLASS.DROPPABLE]: inDesigner,
          [CLASS.SCOPE]: true
        },
        [PROPS.FIELD]: inDesigner ? props.field : undefined,
        [PROPS.SCOPE]: props.field
      }

      const content = fields.map(f => {
        return renderField(inDesigner ? f : value[f.name], { parentProps: { disabled } })
      })

      return (
        <div class={className}>
          <div class="card">
            { renderHeader(props.field) }          
            <div {...bodyProps}>
              { tip }
              { content }
            </div>
          </div>
          { message && <p class="xform-item-message">{message}</p> }
        </div>
      )
    }
  }
})

const view = defineComponent({
  name: 'xform-bs-group-view',
  props: {
    field: {
      type: FormField,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props){
    const { renderField } = useRenderContext()
    const { collasped, renderHeader } = useHeader()

    return function(){
      const value = props.field.value
      const fields = props.field.fields
      const className = {
        'xform-item': true,
        'xform-bs-group': true,
        'xform-is-collasped': collasped.value
      }

      return (
        <div class={className}>
          <div class="card">
            { renderHeader(props.field) }          
            <div class={['card-body', GROUP_LIST_CLASS]}>
              { fields.map(f => renderField(value[f.name], { parentProps: { disabled: props.disabled } })) }
            </div>  
          </div>
        </div>
      )
    }
  }
})

export default FieldConf.create({
  icon: icon,
  type: 'group',
  title: '分组',
  custom: true,
  preview: build,
  setting,
  build,
  view,
  onDragOver(event){
    const current = event.currentTarget
    if(!current.matches(GROUP_LIST_SELECTOR)) return

    event.stopPropagation()
    event.preventDefault()

    const { directionY, moveMarkEl } = event.context
    // 处理拖拽外层字段
    const isMockDef = event.dragElement.contains(current)
    const target = isMockDef ? event.dragElement : event.target
    const scope = isMockDef ? event.dragElement.parentElement.closest(SELECTOR.DROPPABLE) : current

    moveMarkEl(directionY, target, scope)
  },
  onDrop(event){
    const current = event.currentTarget
    if(!current.matches(SELECTOR.SCOPE)) return

    event.stopPropagation()
  },
  onValueInit(field, value: any){
    const v = (null == value || typeof value != 'object') ? {} : value

    return field.fields.reduce((acc, f) => {
      const newField = f.clone(true)
      newField.setValue(v[f.name] ?? null)
      newField.setParent(field)
      acc[f.name] = newField
      return acc
    }, {} as any) 
  },
  onValueSubmit(field){
    const value = field.value
    if(value == null || typeof value != 'object' || Object.keys(value).length == 0) return null

    return field.fields.map(f => f.name).reduce((acc, key) => {
      const f = Reflect.get(value, key, value) as FormField
      if(f != null){
        const fc = f.conf
        const v = (typeof fc?.onValueSubmit == 'function') ? fc.onValueSubmit(f) : f.value
        Reflect.set(acc, key, v, acc)
      }
      return acc
    }, {})
  },
  validator(field, v, options){
    const value = field.value as GroupValue 

    const promise = Object.keys(value).map(key => {
      const f = value[key]
      if(options.mode == EnumValidateMode.RECURSIVE){
        return f.validate({ mode: EnumValidateMode.RECURSIVE })
      }

      return f.invalid ? Promise.reject() : Promise.resolve()
    })

    return Promise.allSettled(promise).then(r => {
      return r.some(i => i.status === 'rejected') ? Promise.reject('请补全必填内容') : Promise.resolve()
    }) 
  }
})