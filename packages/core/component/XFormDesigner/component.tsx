import Store from '@core/store'
import useDragging from './dragging'

import { 
  ComponentInternalInstance,
  ComponentOptions,
  ComponentPublicInstance,
  Slots,
  VNode,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  nextTick,
  provide,
  ref,
  resolveComponent,
} from 'vue'

import { 
  XField, 
  XFieldConf,
  XFormSchema,
  ModeGroup,
  DragModeEnum,
  ATTRS, 
  RawProps
} from '@core/model'

import { isHidden, normalizeWheel } from '@core/util/dom'
import { XFORM_FORM_SCHEMA_PROVIDE_KEY, SELECTOR, CLASS } from '@core/model/constant'
import { ComponentEnum } from '@core/model/XFieldConf'
import { getFieldComponent } from '@core/util/component'

import IconClone from '!!raw-loader!@common/svg/clone.svg'
import IconRemove from '!!raw-loader!@common/svg/remove.svg'
import XFormTip from '@core/assets/img/xform-tip.png'

const IS_BASE64 = /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)\s*$/i
const IS_SVG = /<svg(\s[^>]*)?>[\s\S]*<\/svg>/

interface XFormDesignerProps {
  mode: string;
  schema: XFormSchema;
}

interface XFormDesignerSetupState {
  groups?: ModeGroup[];
  icon?: any;
  selectedField?: XField;
  selectedTab?: string;

  clone?: Function;
  remove?: Function;
  doScroll?: (event: WheelEvent) => void;
  dragstart?: Function;
  chooseTab?: Function;
  chooseField?: Function;
  updateSchema?: Function;

  [prop: string]: any;
} 

export interface XFormDesignerRefs{
  root: Element
  scroll: Element
  list: Element
  mark: Element
  ghost: Element
  template: Element
}

export type XFormDesignerInstance = ComponentPublicInstance & XFormDesignerProps & XFormDesignerSetupState;

function findFieldScope(field: XField, schema: XFormSchema, list: unknown){
  const fieldEl = (list as Element).querySelector(`[xfield-name="${field.name}"`)
  const scopedEl = fieldEl.closest(SELECTOR.SCOPED)
  const scopedFieldName = (
    null != scopedEl && fieldEl != scopedEl 
      ? scopedEl.getAttribute(ATTRS.XFIELD_NAME)
      : null
  )
  
  return (
    scopedFieldName == null 
      ? schema
      : schema.fields.find(f => f.name == scopedFieldName)
  ) 
}

function buildProps(keys: string[], props: any){
  return keys.reduce((acc, key) => {
    acc[key] = props[key]
    return acc
  }, {} as any)
}

function shwoSelectedField(instance: ComponentInternalInstance){
  return nextTick(() => {
    const scroll = instance.refs.scroll as HTMLElement
    const target = (instance.refs.list as HTMLElement).querySelector(SELECTOR.IS_SELECTED) as HTMLElement

    if(isHidden(target, scroll)) scroll.scrollTop = target.offsetTop
  })
}

function renderIcon(fc: XFieldConf){
  const icon = typeof fc.icon == 'function' ? fc.icon(fc) : fc.icon

  if(isVNode(icon)) return icon
  if(IS_BASE64.test(icon)) return <img src={icon} class="xform-icon xform-icon-is-img"/>
  if(IS_SVG.test(icon)) return h('i', { innerHTML: icon, className: 'xform-icon xform-icon-is-svg' })

  return <i class={icon}/>
}

function renderFieldPanel(groups: ModeGroup[], dragstart: Function){
  return groups.map((group, i) => {
    const title = group.title ? <h3>{group.title}</h3> : null
    const fcs = group.fieldConfs
    const types = fcs.filter(fc => fc != null).map(fc => {
      const props = {
        'class': 'xform-designer-field xform-draggable xform-template',
        'key': fc.type,
        'onMousedown': (e: Event) => dragstart(e, DragModeEnum.INSERT),
        [ATTRS.XFIELD_TYPE]: fc.type,
      }

      return (
        <div {...props}>
          <strong>{fc.title}</strong>
          {renderIcon(fc)}
        </div>
      ) 
    })

    return (
      <div key={i} class="xform-designer-field-group">
        {title}
        <div class="xform-designer-field-list">{types}</div>
      </div>
    )
  })
}

function renderItem(field: XField, mode: string, renderField: Function){
  const component = getFieldComponent(field, ComponentEnum.PREVIEW, mode) || getFieldComponent(field, ComponentEnum.BUILD, mode)
  const allProps = { field, renderField, behavior: 'designer' }
  
  if(field.conf?.custom === true && null != component) {
    return h(component, buildProps(Object.keys(component.props || {}), allProps))
  }

  if(null == component) {
    console.warn(`field[${field.title}: ${field.name}] not implement preview component`)
    return <p class="xform-is-unknown">暂不支持的字段类型</p>
  }

  const XFormItem = resolveComponent('xform-item') as ComponentOptions
  return h(XFormItem, { field, validation: false }, () => h(component, buildProps(Object.keys(component.props || {}), allProps)))
}

function renderPreview(instance: XFormDesignerInstance, field: XField){
  const { selectedField, icon, clone, remove, dragstart, chooseField } = instance

  const buttons = [
    <button type="button" title="复制" onClick={clone.bind(null, field)} innerHTML={icon.clone}/>
  ]

  if(field.attributes.remove !== false) {
    buttons.push(<button type="button" title="删除" onClick={remove.bind(null, field)} innerHTML={icon.remove}/>)
  }

  const props = {
    'class': {
      'xform-preview': true,
      ['xform-preview-' + field.type]: true,
      'xform-draggable': true,
      'xform-droppable': true,
      'xform-is-selected': field == selectedField,
      [CLASS.SCOPED]: field.conf?.scoped ?? false
    },
    'key': field.name,
    [ATTRS.XFIELD_TYPE]: field.type,
    [ATTRS.XFIELD_NAME]: field.name
  }

  return (
    <div {...props}>
      {renderItem(field, instance.mode, renderPreview.bind(null, instance))}

      <div class="xform-preview-addition">
        <div class="xform-preview-operate">{buttons}</div>
        <div class="xform-preview-cover" onMousedown={e => dragstart(e, DragModeEnum.SORT, field)} onClick={chooseField.bind(null, field)}/>
      </div>
    </div>
  )
}

function renderPreviewList(instance: XFormDesignerInstance, fields: XField[]){
  if(fields.length == 0) return renderEmptyTip()

  return fields.map(field => renderPreview(instance, field))
}

/**
 * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`setting_name_[name]`对应的slot
 * 2. 检索是否有名为`setting_type_[type]`对应的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderFieldSetting(field: XField, slots: Slots, instance: XFormDesignerInstance){
  if(null == field || null == field.conf) return <p class="xform-setting-tip">点击字段设置属性</p>

  const props: RawProps = { field: field, key: field.name }

  const nameSlotFunc = slots[`setting_name_${field.name}`]
  const nameSlot: VNode[] = typeof nameSlotFunc == 'function' && nameSlotFunc(props)
  if(nameSlot.length > 0) return nameSlot

  const typeSlotFunc = slots[`setting_type_${field.type}`]
  const typeSlot: VNode[] = typeof typeSlotFunc == 'function' && typeSlotFunc(props)
  if(typeSlot.length > 0) return typeSlot

  if(field.conf.setting == null) {
    console.warn(`field[${field.title}: ${field.name}] not implement setting component`)
    return null
  }

  // 监听字段更新
  props['onUpdate:field'] = function(event: any){
    const { prop, value, scope } = event
    let target = field as any
    if(null != scope){
      if(target[scope] == null) target[scope] = {}
      target = target[scope]
    } 
    target[prop] = value
    instance.updateSchema()
  }

  const component = getFieldComponent(field, ComponentEnum.SETTING, instance.mode)
  return h(component, props)
}

function renderFormSetting(slots: Slots, schema: XFormSchema, instance: XFormDesignerInstance){
  const { setting } = slots
  const vnodes: VNode[] = typeof setting == 'function' ? setting({ schema }) : []
  if(vnodes.length > 0) return vnodes

  const preset = Store.getPreset()
  if(preset && preset.slots.setting) return h(preset.slots.setting, {
    schema,
    'onUpdate:prop': function(event: any){
      const { prop, value } = event
      schema[prop] = value
      instance.updateSchema(schema)
    }
  })

  return null
}

function renderSetting(slots: Slots, schema: XFormSchema, instance: XFormDesignerInstance){
  const { selectedField, selectedTab, chooseTab } = instance
  const formSetting = renderFormSetting(slots, schema, instance)

  if(null == formSetting) return (
    <div class="xform-designer-setting-field xform-is-scroll">
      {renderFieldSetting(selectedField, slots, instance)}
    </div>
  )

  const tabContent = (
    selectedTab == 'field' 
      ? renderFieldSetting(selectedField, slots, instance)
      : formSetting
  )

  return [
    <ul class="xform-tabs">
      <li class={{ 'xform-is-active': selectedTab == 'field' }} onClick={chooseTab.bind(null, 'field')}>字段</li>
      <li class={{ 'xform-is-active': selectedTab == 'form' }} onClick={chooseTab.bind(null, 'form')}>表单</li>
    </ul>,
    <div class="xform-tabs-main xform-is-scroll">
      <div class="xform-tabs-content">{tabContent}</div>
    </div> 
  ]
}

function renderEmptyTip(){
  return (
    <div class="xform-preview-tip">
      <img src={XFormTip}/>
      <p>请将左侧控件拖动到此处</p>
    </div>
  )
}

export default defineComponent({
  name: 'xform-designer',
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    schema: {
      type: Object,
      required: true
    }
  },
  emits: ['update:schema'],
  setup(props: XFormDesignerProps, { emit }){
    const instance = getCurrentInstance()
    const selectedField = ref<XField>(null)
    const selectedTab = ref<string>('form')

    const groups = computed(() => {
      const mode = Store.findMode(props.mode)
      if(null == mode || mode.length == 0) return []

      const group = (typeof mode[0] != 'object' ? [{ types: mode, title: '' }] : mode) as ModeGroup[]
      for(const g of group) g.fieldConfs = g.types.map(Store.findFieldConf)
      return group
    })

    const updateSchema = function(schema: XFormSchema = props.schema){
      emit('update:schema', schema)
    }

    const chooseTab = function(tab: string){
      selectedTab.value = tab
    }

    const chooseField = function(field: XField){
      selectedField.value = field

      chooseTab('field')
      shwoSelectedField(instance)
    }

    const doScroll = function(event: WheelEvent){
      const { pixelY } = normalizeWheel(event)
      const scroll = instance.refs.scroll as HTMLElement

      scroll.scrollTop += pixelY
    }

    const clone = function(field: XField){
      const scope = findFieldScope(field, props.schema, instance.refs.list)
      const clone = field.clone()
      scope.fields.splice(scope.fields.indexOf(field) + 1, 0, clone)
      updateSchema(props.schema)
      chooseField(clone)
    }
    
    const remove = function(field: XField){
      const message = `确定要删除字段[${field.title}]?`
      return Store.getConfig().confirm(message).then(res => {
        if(res === true) {
          const scope = findFieldScope(field, props.schema, instance.refs.list)
          scope.fields.splice(scope.fields.indexOf(field), 1)
          updateSchema(props.schema)
        }
      })
    }

    const { dragstart } = useDragging(instance, chooseField)

    provide(XFORM_FORM_SCHEMA_PROVIDE_KEY, props.schema)
  
    return {
      clone,
      chooseField,
      doScroll,
      dragstart,
      remove,
      groups,
      icon: { clone: IconClone, remove: IconRemove },
      selectedField,
      selectedTab,
      chooseTab,
      updateSchema
    }
  },
  render(instance: XFormDesignerInstance){
    const slots = instance.$slots
    const schema: XFormSchema = instance.schema
    const groups: ModeGroup[] = instance.groups as ModeGroup[]
    const fields: XField[] = Array.isArray(schema.fields) ? schema.fields : []

    const listClassName = {
      'xform-designer-list': true,
      'xform-is-empty': fields.length == 0
    }

    return (
      <div class="xform-designer" ref="root">
        <div class="xform-designer-panel">{ renderFieldPanel(groups, instance.dragstart) }</div>
        <div class="xform-designer-main">
          { typeof slots.tool == 'function' && slots.tool() }
          <div ref="scroll" class="xform-designer-scroll xform-is-scroll">
            <div ref="list" class={listClassName}>
              { renderPreviewList(instance, fields) }
            </div>
          </div>
        </div>
        <div class="xform-designer-setting">{ renderSetting(slots, schema, instance) }</div>
        <div ref="ghost" key="xform-ghost" class="xform-designer-ghost" onWheel={instance.doScroll}>
          <div class="xform-designer-ghost-template" ref="template"/>
          <div class="xform-designer-cover"/>
        </div>
        <div ref="mark" key="xform-mark" class="xform-designer-mark"/>
      </div>
    )
  }
})