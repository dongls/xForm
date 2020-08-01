import { defineComponent, ref } from 'vue'

import { 
  DragContext,
  DragEvent, 
  XField,
  XFieldConf, 
  SELECTOR,
  store,
  ATTRS
} from '@dongls/xform'

import CollapseIcon from '!!raw-loader!../assets/svg/collapse.svg'
import ExpandIcon from '!!raw-loader!../assets/svg/expand.svg'
import icon from '@common/svg/group.svg'
import setting from './setting.vue'

const GROUP_LIST_CLASS = 'xform-bs-group-list'
const GROUP_LIST_SELECTOR = `.${GROUP_LIST_CLASS}`
const MATCH_PATCHS = ['.xform-designer-mark', '.xform-droppable', `.${GROUP_LIST_CLASS}`, '.xform-scoped']

function useHeader(){
  const collasped = ref(false)

  function toggle(event: Event){
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
            class="btn xform-bs-group-toggle" 
            onClick={toggle} 
            v-html={collasped.value ? ExpandIcon : CollapseIcon}
          />
        )
        : null
    )
  
    return <h6 class="card-header">{ btn }<span>{ field.title }</span></h6>
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
    renderField: {
      type: Function,
      default: null
    },
    behavior: {
      type: String,
      default: null
    }
  },
  setup(props){
    const { collasped, renderHeader } = useHeader()

    return function(){
      const renderItem = props.renderField as any
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
              { fields.map(renderItem) }
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
    },
    renderField: {
      type: Function,
      default: null
    }
  },
  setup(props){
    const { collasped, renderHeader } = useHeader()

    return function(){
      const renderField = props.renderField as any
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

export default new XFieldConf({
  icon: icon,
  type: 'group',
  title: '分组',
  custom: true,
  scoped: true,
  preview: build,
  setting,
  build,
  view,
  onDragOver(event: MouseEvent, dragEvent: DragEvent, context: DragContext){
    if(dragEvent.fieldType == 'group') return false

    const hookEl = dragEvent.hookElement
    const target = context.findElementFromPoint(event.clientX, event.clientY, MATCH_PATCHS, hookEl)
    if(target == hookEl) return false

    const listEl = hookEl.querySelector('.' + GROUP_LIST_CLASS)
    context.moveMarkEl(dragEvent.direction, target, context.markEl, listEl, hookEl)
  },
  onDrop(event: MouseEvent, dragEvent: DragEvent, context: DragContext){
    const schema = context.schema
    const markEl = context.markEl
    const dropEl = dragEvent.dropElement
    const name = dropEl.getAttribute(ATTRS.XFIELD_NAME)
    const group = schema.fields.find(f => f.name == name)

    // 插入时直接在对应位置添加新字段即可
    if(dragEvent.mode == 'insert'){
      const type = dragEvent.fieldType
      const fc = store.findFieldConf(type)
      const index = Array.prototype.indexOf.call(dropEl.children, markEl)
      const newField = new XField(fc)
      group.fields.splice(index, 0, newField)
      context.triggerUpdateSchema()
      return context.chooseField(newField)
    }

    // 排序时需要处理字段的来源
    if(dragEvent.mode == 'sort'){
      const field = dragEvent.field
      // 先查询原字段
      const originEl = context.rootEl.querySelector(`${SELECTOR.DRAGGABLE}[xfield-name="${field.name}"]`)
      const originScopedEl = originEl.closest(SELECTOR.SCOPED)
      const schemaIndex = schema.fields.indexOf(field)
      const list = dropEl.querySelector(GROUP_LIST_SELECTOR).children
      const newIndex = Array.prototype.indexOf.call(list, markEl)

      // 如果原字段在scope中, 需要调用对应字段类型的onRemove方法
      if(null != originScopedEl && originScopedEl != dropEl){
        const name = originScopedEl.getAttribute(ATTRS.XFIELD_NAME)
        const scopedField = schema.fields.find(f => f.name == name)
        
        const oldIndex = scopedField.fields.indexOf(field)
        scopedField.fields.splice(oldIndex, 1)

        group.fields.splice(newIndex, 0, field)
      } else if(schemaIndex >= 0){
        // 如果原字段在顶层schema中
        schema.fields.splice(schemaIndex, 1)
        group.fields.splice(newIndex, 0, field)
      } else {
        const oldIndex = group.fields.indexOf(field)
        context.sort(oldIndex, newIndex, group.fields)
      }

      context.triggerUpdateSchema()
      return context.chooseField(field)
    }
  }
})