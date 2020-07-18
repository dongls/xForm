import Store from '@core/store'
import useDragging from './dragging'

import { 
  getCurrentInstance,
  defineComponent,
  computed,
  ref,
  nextTick,
  ComponentInternalInstance,
  h,
  isVNode,
  provide,
  resolveComponent,
  VNode,
  Slots,
  ComponentPublicInstance,
  ComponentOptions,
  VNodeProps
} from 'vue'

import { 
  XField, 
  XFieldConf,
  XFormSchema,
  ModeGroup,
  DragModeEnum
} from '@core/model'

import { isHidden, normalizeWheel } from '@core/util/dom'
import { XFORM_FORM_SCHEMA_SYMBOL, SELECTOR } from '@core/model/constant'
import { ComponentEnum } from '@core/model/XFieldConf'
import { getFieldComponent } from '@core/util/component'

import IconCopy from '!!raw-loader!@common/svg/copy.svg'
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
  isEmpty?: boolean;
  selectedField?: XField;
  selectedTab?: string;

  copy?: Function;
  remove?: Function;
  doScroll?: (event: WheelEvent) => void;
  dragstart?: Function;
  chooseTab?: Function;
  chooseField?: Function;
  updateSchema?: Function;

  [prop: string]: any;
} 

type XFormDesignerInstance = ComponentPublicInstance & XFormDesignerProps & XFormDesignerSetupState;

type RawProps = VNodeProps & {
  [key: string]: any;
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
  if(IS_SVG) return h('i', { innerHTML: icon, className: 'xform-icon xform-icon-is-svg' })

  return <i class={icon}/>
}

function renderFieldGroup(groups: ModeGroup[], dragstart: Function){
  return groups.map((group, i) => {
    const title = group.title ? <h3>{group.title}</h3> : null
    const fcs = group.fieldConfs
    const types = fcs.filter(fc => fc != null).map(fc => (
      <div 
        class="xform-designer-field xform-draggable xform-template"
        data-field={fc.type} key={fc.type}
        onMousedown={e => dragstart(e, DragModeEnum.INSERT)}
      >
        <strong>{fc.title}</strong>
        {renderIcon(fc)}
      </div>
    ))

    return (
      <div key={i} class="xform-designer-field-group">
        {title}
        <div class="xform-designer-field-list">{types}</div>
      </div>
    )
  })
}

function renderPreivew(field: XField, mode: string){
  const fc = field.findFieldConf()
  const component = getFieldComponent(field, ComponentEnum.PREVIEW, mode) || getFieldComponent(field, ComponentEnum.BUILD, mode)
  if(fc.custom && null != component) return h(component, { field })

  if(null == component) {
    console.warn(`field[${field.title}: ${field.name}] not implement preview component`)
    return <p class="xform-is-unknown">暂不支持的字段类型</p>
  }

  const XFormItem = resolveComponent('xform-item') as ComponentOptions
  return h(XFormItem, { field, validation: false }, () => h(component, { field }))
}

function renderPreviewList(fields: XField[], instance: XFormDesignerInstance){
  const { selectedField, icon, copy, remove, dragstart, chooseField } = instance

  return fields.map(field => {
    const className = {
      'xform-designer-preview': true,
      'xform-draggable': true,
      'xform-droppable': true,
      'xform-is-selected': field == selectedField
    }

    const buttons = [
      h('button', { type: 'button', title: '复制', innerHTML: icon.copy, onClick: copy.bind(null, field) })
    ]

    if(field.attributes.remove !== false) buttons.push(h('button', { type: 'button', title: '删除', innerHTML: icon.remove, onClick: remove.bind(null, field) }))

    return (
      <div class={className} key={field.name}>
        {renderPreivew(field, instance.mode)}
        <div class="xform-designer-operate">{buttons}</div>
        <div class="xform-designer-cover" onMousedown={e => dragstart(e, DragModeEnum.SORT, field)} onClick={chooseField.bind(null, field)}/>
      </div>
    )
  })
}

/**
 * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`setting_name_[name]`对应的slot
 * 2. 检索是否有名为`setting_type_[type]`对应的slot
 * 3. 检索字段对应的XFieldConf中配置的组件
 */
function renderFieldSetting(field: XField, slots: Slots, instance: XFormDesignerInstance){
  const fieldConf = (field instanceof XField) && field.findFieldConf()
  if(!fieldConf) return <p class="xform-setting-tip">点击字段设置属性</p>

  const props: RawProps = { field: field, key: field.name }

  const nameSlotFunc = slots[`setting_name_${field.name}`]
  const nameSlot: VNode[] = typeof nameSlotFunc == 'function' && nameSlotFunc(props)
  if(nameSlot.length > 0) return nameSlot

  const typeSlotFunc = slots[`setting_type_${field.type}`]
  const typeSlot: VNode[] = typeof typeSlotFunc == 'function' && typeSlotFunc(props)
  if(typeSlot.length > 0) return typeSlot

  if(fieldConf.setting == null) {
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
  if(null == formSetting) return <div class="xform-designer-setting-field xform-is-scroll">{renderFieldSetting(selectedField, slots, instance)}</div>

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

function renderEmptyTip(isEmpty: boolean){
  if(!isEmpty) return null
  return (
    <div class="xform-designer-preview-tip">
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

    const copy = function(field: XField){
      const copy = field.copy()
      const schema = props.schema
      const index = schema.fields.indexOf(field)

      schema.fields.splice(index + 1, 0, copy)
      updateSchema(schema)
      chooseField(copy)
    }
    
    const remove = function(field: XField){
      const message = `确定要删除字段[${field.title}]?`
      return Store.getConfig().confirm(message).then(res => {
        if(res === true) {
          const schema = props.schema
          schema.fields.splice(schema.fields.indexOf(field), 1)
          updateSchema(schema)
        }
      })
    }

    const { dragstart } = useDragging(instance, props.schema, chooseField)

    provide(XFORM_FORM_SCHEMA_SYMBOL, props.schema)
  
    return {
      copy,
      chooseField,
      doScroll,
      dragstart,
      remove,
      groups,
      icon: { copy: IconCopy, remove: IconRemove },
      isEmpty: computed(() => !Array.isArray(props.schema.fields) || props.schema.fields.length == 0),
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
    const fields: XField[] = schema.fields || []

    return (
      <div class="xform-designer">
        <div class="xform-designer-panel">{ renderFieldGroup(groups, instance.dragstart) }</div>
        <div class="xform-designer-main">
          { typeof slots.tool == 'function' && slots.tool() }
          <div ref="scroll" class="xform-designer-scroll xform-is-scroll">
            <div ref="zone" class="xform-designer-zone">
              <div ref="list" class="xform-designer-list">{ renderPreviewList(fields, instance) }</div>
              <div ref="mark" key="xform-mark" class="xform-designer-mark"/>
              { renderEmptyTip(instance.isEmpty) }
            </div>
          </div>
        </div>
        <div class="xform-designer-setting">{ renderSetting(slots, schema, instance) }</div>
        <div ref="ghost" key="xform-ghost" class="xform-designer-ghost" onWheel={instance.doScroll}>
          <div class="xform-designer-ghost-template"/>
          <div class="xform-designer-cover"/>
        </div>
      </div>
    )
  }
})