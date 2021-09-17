import Store from '../../store'
import useDragging from './dragging'

import { 
  ComponentInternalInstance,
  ComponentPublicInstance,
  Slots,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  nextTick,
  provide,
  ref,
  resolveComponent,
  toRef,
  ConcreteComponent,
  createVNode,
  Ref,
} from 'vue'

import { 
  CLASS,
  EnumBehavior,
  EnumComponent,
  EnumDragMode,
  ModeGroup,
  PROPS,
  RawProps,
  SELECTOR,
  XFORM_CONTEXT_PROVIDE_KEY,
  XFORM_SCHEMA_PROVIDE_KEY,
  FormField, 
  FieldConf,
  FormDesignerContext,
  FormSchema,
  RenderOptions,
  UpdateField,
  EVENTS
} from '../../model'

import {
  fillComponentProps,
  genEventName,
  getFieldComponent,
  getHtmlElement,
  isFunction,
  isHidden,
  normalizeWheel,
  toArray,
} from '../../util'

import { useLogic } from '../../logic'

import IconClone from '!!raw-loader!@common/svg/clone.svg'
import IconRemove from '!!raw-loader!@common/svg/remove.svg'
import XFormTip from '../../assets/img/xform-tip.png'

const IS_BASE64 = /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)\s*$/i
const IS_SVG = /<svg(\s[^>]*)?>[\s\S]*<\/svg>/
const SETTING_FORM_SLOT = 'setting_form'

interface XFormDesignerProps {
  mode: string;
  schema: FormSchema;
}

interface XFormDesignerSetupState {
  groups?: ModeGroup[];
  icon?: any;
  selectedField?: FormField;
  selectedTab?: string;

  clone?: Function;
  remove?: Function;
  doScroll?: (event: WheelEvent) => void;
  chooseTab?: Function;
  chooseField?: Function;
  updateSchema?: Function;
  updateField?: UpdateField;
  dragstart: (event: MouseEvent) => void;

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

function shwoSelectedField(instance: ComponentInternalInstance){
  return nextTick(() => {
    const scroll = getHtmlElement(instance.refs, 'scroll')
    const target = getHtmlElement(instance.refs, 'list').querySelector<HTMLElement>(SELECTOR.IS_SELECTED) 
    if(null == target) return

    if(isHidden(target, scroll)) scroll.scrollTop = target.offsetTop
  })
}

/**
 * 字段图标支持以下几种：
 * 1. vnode
 * 2. base64编码的图片
 * 3. svg
 * 4. css class
 */
function renderIcon(fc: FieldConf){
  const icon = typeof fc.icon == 'function' ? fc.icon(fc) : fc.icon

  if(isVNode(icon)) return icon
  if(IS_BASE64.test(icon)) return <img src={icon} class="xform-icon xform-icon-is-img"/>
  if(IS_SVG.test(icon)) return h('i', { innerHTML: icon, className: 'xform-icon xform-icon-is-svg' })

  return <i class={icon}/>
}

function renderOperate(instance: XFormDesignerInstance, field: FormField){
  const { icon, clone, remove } = instance
  const buttons = []

  if(field.allowClone !== false){
    buttons.push(<button type="button" title="复制" onClick={clone.bind(null, field)} innerHTML={icon.clone}/>)
  }

  if(field.allowRemove !== false) {
    buttons.push(<button type="button" title="删除" onClick={remove.bind(null, field)} innerHTML={icon.remove}/>)
  }

  return (
    buttons.length > 0 
      ? <div class="xform-preview-operate">{buttons}</div> 
      : null
  )
}

function renderFieldPanel(groups: ModeGroup[]){
  return groups.map((group, i) => {
    const title = group.title ? <h3>{group.title}</h3> : null
    const fcs = group.fieldConfs
    const types = fcs.length == 0 ? <div class="xform-is-unknown">请先注册该分组下的字段类型</div> : fcs.map(fc => {
      const props = {
        'class': `${CLASS.FIELD} xform-template-${fc.type} ${CLASS.DRAGGABLE}`,
        'key': fc.type,
        [PROPS.FIELD_TYPE]: fc.type,
        [PROPS.DRAG_MODE]: EnumDragMode.INSERT
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

function renderUnknown(field: FormField){
  console.warn(`field[${field.title}: ${field.name}] not implement preview component`)
  return <p class="xform-is-unknown">暂不支持的字段类型</p>
}

/**
 * 根据字段渲染对应的预览组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`preview_name_[name]`的slot
 * 2. 检索是否有名为`preview_type_[type]`的slot
 * 3. 检索字段对应的`FieldConf`中配置的`preview`或`build`组件
 */
function renderContent(instance: XFormDesignerInstance, field: FormField, options: RenderOptions){
  const slots = instance.$slots
  const disabled = field.disabled || options.parentProps?.disabled === true

  const nameSlot = slots[`preview_name_${field.name}`]
  if(isFunction(nameSlot)) return nameSlot({ field, disabled })

  const typeSlot = slots[`preview_type_${field.type}`]
  if(isFunction(typeSlot)) return typeSlot({ field, disabled })

  const mode = instance.mode
  const component = getFieldComponent(field, EnumComponent.PREVIEW, mode) || getFieldComponent(field, EnumComponent.BUILD, mode)
  if(component == null) return null

  const props = fillComponentProps(component, { field, behavior: EnumBehavior.DESIGNER, disabled })
  const create = isFunction(options?.renderContent) ? options.renderContent : h
  return create(component, props)
}

function renderItem(instance: XFormDesignerInstance, field: FormField, options: RenderOptions){
  const children = function(){
    return renderContent(instance, field, options) ?? renderUnknown(field)
  }

  const disabled = field.disabled || options.parentProps?.disabled === true
  const component = resolveComponent('xform-item')
  const props = { field, validation: false, disabled }
  const create = isFunction(options?.renderItem) ? options.renderItem : h
  return create(component, props, children)
}

/** 渲染字段预览组件 */
function renderFieldPreview(instance: XFormDesignerInstance, field: FormField, options: RenderOptions = {}){
  const tag = 'div'
  const props = {
    'class': {
      'xform-preview': true,
      'xform-draggable': true,
      'xform-droppable': true,
      ['xform-preview-' + field.type]: true,
      'xform-is-selected': field == instance.selectedField,
      [CLASS.SCOPE]: field.conf?.scoped,
      'xform-is-preview-hidden': field.hidden
    },
    'key': field.uid,
    [PROPS.FIELD]: field,
    [PROPS.SCOPE]: field.conf?.scoped === true ? field : undefined
  }

  if(__IS_TEST__ === true){
    props.id = `preview_${field.name}`
  }

  const content = function(){
    return renderItem(instance, field, options)
  }

  const children = function(){
    const operate = renderOperate(instance, field)
    const cover = <div class="xform-preview-cover" onClick={instance.chooseField.bind(null, field)}/>
    return [content(), operate, cover]
  }

  if(isFunction(options.renderPreivew)) return options.renderPreivew(tag, props, children, content)
  return h(tag, props, children())
}

function renderPreviewList(instance: XFormDesignerInstance, fields: FormField[]){
  const content = (
    fields.length == 0 
      ? renderEmptyTip() 
      : fields.map(field => renderFieldPreview(instance, field))
  )

  const props = {
    'ref': 'list',
    'class': ['xform-designer-list', CLASS.DROPPABLE],
    [PROPS.SCOPE]: instance.schema
  }

  return (
    <div class="xform-designer-responsive xform-is-pc xform-is-scroll" ref="scroll">
      <div {...props}>{content}</div>
    </div>
  )
}

/**
 * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
 * 1. 检索是否有名为`setting_name_[name]`的slot
 * 2. 检索是否有名为`setting_type_[type]`的slot
 * 3. 检索字段对应的FieldConf中配置的组件
 */
function renderFieldSetting(field: FormField, slots: Slots, instance: XFormDesignerInstance){
  if(null == field || null == field.conf) return <p class="xform-setting-tip">点击字段设置属性</p>

  const props: RawProps = { field: field, key: field.name }

  const nameSlot = slots[`setting_name_${field.name}`]
  if(isFunction(nameSlot)) return nameSlot(props)

  const typeSlot = slots[`setting_type_${field.type}`]
  if(isFunction(typeSlot)) return typeSlot(props)

  const component = getFieldComponent(field, EnumComponent.SETTING, instance.mode)
  if(component == null) {
    console.warn(`[xform] field not implement setting component: ${field.title}(${field.name})`)
    return null
  }

  // 监听字段更新
  props['onUpdate:field'] = instance.updateField.bind(null, field)

  return createVNode(component, props)
}

function renderFormSetting(slots: Slots, schema: FormSchema, instance: XFormDesignerInstance){
  if(isFunction(slots[SETTING_FORM_SLOT])) return slots[SETTING_FORM_SLOT]({ schema })

  const preset = Store.getPreset()
  if(preset?.slots?.[SETTING_FORM_SLOT]) return h(preset.slots[SETTING_FORM_SLOT] as ConcreteComponent, {
    schema,
    'onUpdate:prop': function(event: any){
      const { prop, value } = event
      schema[prop] = value
      instance.updateSchema(schema)
    }
  })

  return null
}

function renderSetting(slots: Slots, schema: FormSchema, instance: XFormDesignerInstance){
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
    <div class={[CLASS.IS_EMPTY_TIP, 'xform-preview-empty-tip']}>
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
  emits: [
    EVENTS.UPDATE_SCHEMA,
    EVENTS.REMOVE,
    EVENTS.MESSAGE
  ],
  setup(props: XFormDesignerProps, { emit }){
    const instance = getCurrentInstance()
    const selectedField = ref(null) as Ref<FormField>
    const selectedTab = ref<string>('form')
    const groups = computed(() => Store.findFieldGroups(props.mode))
    const { dragstart } = useDragging()

    if(Store.getConfig().logic === true) {
      useLogic(toRef(props, 'schema') as Ref<FormSchema>, (data: any) => emit(EVENTS.MESSAGE, data))
    }
    
    const updateSchema = function(schema: FormSchema = props.schema){
      emit(EVENTS.UPDATE_SCHEMA, schema)
    }

    const chooseTab = function(tab: string){
      selectedTab.value = tab
    }

    const chooseField = function(field: FormField){
      selectedField.value = field
      if(null == field) return

      chooseTab('field')
      shwoSelectedField(instance)
    }

    const resetSelectedField = function(){
      selectedField.value = null
    }

    const doScroll = function(event: WheelEvent){
      const { pixelY } = normalizeWheel(event)
      const scroll = instance.refs.scroll as HTMLElement

      scroll.scrollTop += pixelY
    }

    const clone = function(field: FormField){
      if(field.allowClone === false) return

      const scope = field.parent
      const newField = field.clone()
      scope.insert(scope.indexOf(field) + 1, newField)
      updateSchema(props.schema)
      chooseField(newField)
    }
    
    const remove = function(field: FormField){
      if(field.allowRemove === false) return

      const name = genEventName(EVENTS.REMOVE)
      const listener = instance.vnode?.props?.[name]
      const useDefault = function(){
        const scope = field.parent
        scope.remove(field)
        chooseField(null)
        updateSchema(props.schema)

        nextTick(() => {
          const hook = field.conf?.onRemoved
          isFunction(hook) && hook(field, scope, instance) 
        })
      }
      
      isFunction(listener) ? emit(EVENTS.REMOVE, { field, useDefault }): useDefault()
    }

    const updateField: UpdateField = function(field, event){
      const { prop, value, scope } = event

      let target = field
      if(null != scope){
        if(target[scope] == null) target[scope] = {}
        target = target[scope]
      }

      target[prop] = value
      updateSchema()
    }

    provide(XFORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<FormDesignerContext>(XFORM_CONTEXT_PROVIDE_KEY, {
      type: 'designer',
      renderField: renderFieldPreview.bind(null, instance.proxy),
      updateField,
      chooseField,
      emit
    })
  
    return {
      clone,
      chooseField,
      chooseTab,
      doScroll,
      groups,
      icon: { clone: IconClone, remove: IconRemove },
      remove,
      resetSelectedField,
      selectedField,
      selectedTab,
      updateSchema,
      updateField,
      dragstart
    }
  },
  render(instance: XFormDesignerInstance){
    const slots = instance.$slots
    const schema = instance.schema
    const groups = instance.groups as ModeGroup[]
    const fields: FormField[] = toArray(schema.fields)

    return (
      <div class="xform-designer" ref="root" onMousedown={instance.dragstart}>
        <div class="xform-designer-panel">
          { renderFieldPanel(groups) }
        </div>
        <div class="xform-designer-main">
          { isFunction(slots.tool) && slots.tool() }
          <div class="xform-designer-board">
            { renderPreviewList(instance, fields) }
          </div>
        </div>
        <div class="xform-designer-setting">
          { renderSetting(slots, schema, instance) }
        </div>
        <div ref="ghost" key="xform-designer-ghost" class="xform-designer-ghost" onWheel={instance.doScroll}>
          <div class="xform-designer-ghost-template" ref="template"/>
          <div class="xform-designer-cover"/>
        </div>
        <div ref="mark" key="xform-designer-mark" class="xform-designer-mark"><hr/></div>
      </div>
    )
  }
})