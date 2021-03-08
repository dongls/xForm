import { defineComponent, ref } from 'vue'

import { 
  XField,
  XFieldConf, 
  constant,
  useContext,
} from '@dongls/xform'

import icon from '@common/svg/group.svg'
import setting from './setting.vue'

const { SELECTOR, CLASS, EnumBehavior, PROPS } = constant
const GROUP_LIST_CLASS = 'xform-bs-group-list'
const GROUP_LIST_SELECTOR = `.${GROUP_LIST_CLASS}`

function useHeader(){
  const collasped = ref(false)

  function toggle(){
    collasped.value = !collasped.value
  }

  function renderHeader(field: XField){
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
      type: XField,
      required: true
    },
    behavior: {
      type: String,
      default: null
    }
  },
  setup(props){
    const { collasped, renderHeader } = useHeader()
    const { renderField } = useContext()

    return function(){
      const fields = props.field.fields
      const inDesigner = props.behavior == EnumBehavior.DESIGNER
      const className = {
        'xform-item': true,
        'xform-bs-group': true,
        'xform-is-collasped': collasped.value
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
        [PROPS.XFIELD]: inDesigner ? props.field : undefined,
        [PROPS.SCOPE]: props.field
      }

      return (
        <div class={className}>
          <div class="card">
            { renderHeader(props.field) }          
            <div {...bodyProps}>
              { tip }
              { fields.map(f => renderField(f)) }
            </div>
          </div>
        </div>
      )
    }
  }
})

const view = defineComponent({
  name: 'xform-bs-group-view',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props){
    const { renderField } = useContext()
    const { collasped, renderHeader } = useHeader()

    return function(){
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
              { fields.map(f => renderField(f)) }
            </div>  
          </div>
        </div>
      )
    }
  }
})

export default XFieldConf.create({
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
    const isMockDef = event.dragElement.contains(current)
    const target = isMockDef ? event.dragElement : event.target
    const scope = isMockDef ? event.dragElement.parentElement.closest(SELECTOR.DROPPABLE) : current

    moveMarkEl(directionY, target, scope)
  },
  onDrop(event){
    const current = event.currentTarget
    if(!current.matches(SELECTOR.SCOPE)) return

    event.stopPropagation()
  }
})