import { defineComponent, ref } from 'vue'

import { 
  GlobalDragEvent,
  XField,
  XFieldConf, 
  XFormSchema,
  findElementFromPoint,
  getRef,
  getXField,
  store,
  constant,
  useContext,
} from '@dongls/xform'

import icon from '@common/svg/group.svg'
import setting from './setting.vue'

const { SELECTOR } = constant
const GROUP_LIST_CLASS = 'xform-bs-group-list'
const GROUP_LIST_SELECTOR = `.${GROUP_LIST_CLASS}`
const MATCH_PATCHS = ['.xform-designer-mark', SELECTOR.DROPPABLE, `.${GROUP_LIST_CLASS}`, SELECTOR.SCOPE]

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
      const className = {
        'xform-item': true,
        'xform-bs-group': true,
        'xform-is-collasped': collasped.value
      }

      return (
        <div class={className}>
          <div class="card">
            { renderHeader(props.field) }          
            <div class="card-body xform-bs-group-list">
              { fields.map(renderField) }
            </div>
            { props.behavior == 'designer'  && fields.length == 0 && <p class="xform-bs-group-empty">请将左侧控件拖动到此处</p> }
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
            <div class="card-body xform-bs-group-list">
              { fields.map(renderField) }
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
  scoped: true,
  preview: build,
  setting,
  build,
  view,
  onDragOver(event: GlobalDragEvent){
    if(event.data.type == 'group') return false
    
    const hookEl = event.hookElement
    const originEvent = event.originEvent as MouseEvent
    const target = findElementFromPoint(originEvent.clientX, originEvent.clientY, MATCH_PATCHS, hookEl)
    if(target == hookEl) return false

    const context = event.context
    const instance = context.getInternalInstance()
    const listEl = hookEl.querySelector(GROUP_LIST_SELECTOR)
    const mark = getRef<HTMLElement>(instance.refs, 'mark')
    context.moveMark(event.direction, target, mark, listEl, hookEl)
  },
  onDrop(event: GlobalDragEvent){
    const context = event.context
    const instance = context.getInternalInstance()
    const pInstance = context.getPublicInstance()
    const schema = instance.props.schema as XFormSchema
    const markEl = instance.refs.mark as HTMLElement
    const dropEl = event.dropElement
    const group = getXField(dropEl)

    // 插入时直接在对应位置添加新字段即可
    if(event.mode == 'insert'){
      const type = event.data.type
      const fc = store.findFieldConf(type)
      const index = Array.prototype.indexOf.call(dropEl.children, markEl)
      const newField = new XField(fc)
      group.fields.splice(index, 0, newField)
      pInstance.updateSchema()
      pInstance.chooseField(newField)
      return
    }

    // 排序时需要处理字段的来源
    if(event.mode == 'sort'){
      const field = event.data.field
      // 先查询原字段
      const originScopedEl = event.target.closest(SELECTOR.SCOPE)
      const schemaIndex = schema.fields.indexOf(field)
      const list = dropEl.querySelector(GROUP_LIST_SELECTOR).children
      const newIndex = Array.prototype.indexOf.call(list, markEl)

      // 如果原字段在scope中, 需要调用对应字段类型的onRemove方法
      if(null != originScopedEl && originScopedEl != dropEl){
        const scopedField = getXField(originScopedEl)
        
        const oldIndex = scopedField.fields.indexOf(field)
        scopedField.fields.splice(oldIndex, 1)

        group.fields.splice(newIndex, 0, field)
      } else if(schemaIndex >= 0){
        // 如果原字段在顶层schema中
        schema.fields.splice(schemaIndex, 1)
        group.fields.splice(newIndex, 0, field)
      } else {
        const oldIndex = group.fields.indexOf(field)
        context.moveField(oldIndex, newIndex, group.fields)
      }

      pInstance.updateSchema()
      return pInstance.chooseField(field)
    }
  }
})