import Store from '../../api/store'
import useDragging from './dragging'

import { 
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  nextTick,
  provide,
  ref,
  resolveComponent,
  toRef,
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
  EVENTS,
  UpdateFieldEvent
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

export interface FormDesignerApi {
  chooseField: (field: FormField) => void;
  updateSchema: (schema?: FormSchema) => void;
  resetSelectedField: () => void
} 

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

function renderUnknown(field: FormField){
  console.warn(`field[${field.title}: ${field.name}] not implement preview component`)
  return <p class="xform-is-unknown">暂不支持的字段类型</p>
}

function renderEmptyTip(){
  return (
    <div class={[CLASS.IS_EMPTY_TIP, 'xform-preview-empty-tip']}>
      <img src={XFormTip}/>
      <p>请将左侧控件拖动到此处</p>
    </div>
  )
}

function useRenderContext(instance: ComponentInternalInstance, schemaRef: Ref<FormSchema>, modeRef: Ref<string>){
  const selectedField = ref(null) as Ref<FormField>
  const selectedTab = ref<string>('form')
  
  const icon = { clone: IconClone, remove: IconRemove }

  function updateSchema(schema?: FormSchema){
    instance.emit(EVENTS.UPDATE_SCHEMA, schema ?? schemaRef.value)
  }

  function chooseTab(tab: string){
    selectedTab.value = tab
  }

  function chooseField(field: FormField){
    selectedField.value = field
    if(null == field) return

    chooseTab('field')
    shwoSelectedField(instance)
  }

  function resetSelectedField(){
    selectedField.value = null
  } 

  function clone(field: FormField){
    if(field.allowClone === false) return

    const scope = field.parent
    const newField = field.clone()
    scope.insert(scope.indexOf(field) + 1, newField)
    updateSchema()
    chooseField(newField)
  }
  
  function remove(field: FormField){
    if(field.allowRemove === false) return

    const name = genEventName(EVENTS.REMOVE)
    const listener = instance.vnode?.props?.[name]
    const useDefault = function(){
      const scope = field.parent
      scope.remove(field)
      chooseField(null)
      updateSchema()

      nextTick(() => {
        const hook = field.conf?.onRemoved
        isFunction(hook) && hook(field, scope, instance) 
      })
    }
    
    isFunction(listener) ? instance.emit(EVENTS.REMOVE, { field, useDefault }): useDefault()
  }

  function updateField(field: FormField, event: UpdateFieldEvent){
    const { prop, value, scope } = event

    let target = field
    if(null != scope){
      if(target[scope] == null) target[scope] = {}
      target = target[scope]
    }

    target[prop] = value
    updateSchema()
  }

  function renderFieldPanel(groups: ModeGroup[]){
    return groups.map((group, i) => {
      const title = group.title ? <h3>{group.title}</h3> : null
      const fcs = group.fieldConfs
      const types = fcs.length == 0 ? <div class="xform-is-unknown">请先注册该分组下的字段类型</div> : fcs.map(fc => {
        const props = {
          'class': `${CLASS.FIELD} xform-template-${fc.type} ${CLASS.DRAGGABLE}`,
          'key': fc.type,
          ['.' + PROPS.FIELD_TYPE]: fc.type,
          ['.' + PROPS.DRAG_MODE]: EnumDragMode.INSERT
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

  /**
   * 根据字段创建对应的设置组件，按以下顺序逐次匹配：
   * 1. 检索是否有名为`setting_name_[name]`的slot
   * 2. 检索是否有名为`setting_type_[type]`的slot
   * 3. 检索字段对应的FieldConf中配置的组件
   */
  function renderFieldSetting(field: FormField){
    if(null == field || null == field.conf) return <p class="xform-setting-tip">点击字段设置属性</p>
    
    const slots = instance.slots
    const props: RawProps = { field: field, key: field.name }

    const nameSlot = slots[`setting_name_${field.name}`]
    if(isFunction(nameSlot)) return nameSlot(props)

    const typeSlot = slots[`setting_type_${field.type}`]
    if(isFunction(typeSlot)) return typeSlot(props)

    const component = getFieldComponent(field, EnumComponent.SETTING, modeRef.value)
    if(component == null) {
      console.warn(`[xform] field not implement setting component: ${field.title}(${field.name})`)
      return null
    }

    // 监听字段更新
    props['onUpdate:field'] = updateField.bind(null, field)

    return createVNode(component, props)
  }

  function renderFormSetting(schema: FormSchema){
    const slots = instance.slots
    if(isFunction(slots[SETTING_FORM_SLOT])) return slots[SETTING_FORM_SLOT]({ schema })

    const preset = Store.getPreset()
    if(preset?.slots?.[SETTING_FORM_SLOT]) return h(preset.slots[SETTING_FORM_SLOT], {
      schema,
      'onUpdate:prop': function(event: any){
        const { prop, value } = event
        schema[prop] = value
        updateSchema(schema)
      }
    })

    return null
  }

  function renderSetting(schema: FormSchema){
    const formSetting = renderFormSetting(schema)
  
    if(null == formSetting) return (
      <div class="xform-designer-setting-field xform-is-scroll">
        {renderFieldSetting(selectedField.value)}
      </div>
    )
  
    const tabContent = (
      selectedTab.value == 'field' 
        ? renderFieldSetting(selectedField.value)
        : formSetting
    )
  
    return [
      <ul class="xform-tabs">
        <li class={{ 'xform-is-active': selectedTab.value == 'field' }} onClick={chooseTab.bind(null, 'field')}>字段</li>
        <li class={{ 'xform-is-active': selectedTab.value == 'form' }} onClick={chooseTab.bind(null, 'form')}>表单</li>
      </ul>,
      <div class="xform-tabs-main xform-is-scroll">
        <div class="xform-tabs-content">{tabContent}</div>
      </div> 
    ]
  }

  function renderOperate(field: FormField){
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

  /**
   * 根据字段渲染对应的预览组件，按以下顺序逐次匹配：
   * 1. 检索是否有名为`preview_name_[name]`的slot
   * 2. 检索是否有名为`preview_type_[type]`的slot
   * 3. 检索字段对应的`FieldConf`中配置的`preview`或`build`组件
   */
  function renderContent(field: FormField, options: RenderOptions){
    const slots = instance.slots
    const disabled = field.disabled || options.parentProps?.disabled === true

    const nameSlot = slots[`preview_name_${field.name}`]
    if(isFunction(nameSlot)) return nameSlot({ field, disabled })

    const typeSlot = slots[`preview_type_${field.type}`]
    if(isFunction(typeSlot)) return typeSlot({ field, disabled })

    const mode = modeRef.value
    const component = getFieldComponent(field, EnumComponent.PREVIEW, mode) || getFieldComponent(field, EnumComponent.BUILD, mode)
    if(component == null) return null

    const props = fillComponentProps(component, { field, behavior: EnumBehavior.DESIGNER, disabled })
    const create = isFunction(options?.renderContent) ? options.renderContent : h
    return create(component, props)
  }

  function renderItem(field: FormField, options: RenderOptions){
    const children = function(){
      return renderContent(field, options) ?? renderUnknown(field)
    }

    const disabled = field.disabled || options.parentProps?.disabled === true
    const component = resolveComponent('xform-item') as any
    const props = { field, validation: false, disabled }
    const create = isFunction(options?.renderItem) ? options.renderItem : h
    return create(component, props, children)
  }

  /** 渲染字段预览组件 */
  function renderField(field: FormField, options: RenderOptions = {}){
    const tag = 'div'
    const props = {
      'class': {
        'xform-preview': true,
        'xform-draggable': true,
        'xform-droppable': true,
        ['xform-preview-' + field.type]: true,
        'xform-is-selected': field == selectedField.value,
        [CLASS.SCOPE]: field.conf?.scoped,
        'xform-is-preview-hidden': field.hidden
      },
      'key': field.uid,
      ['.' + PROPS.FIELD]: field,
      ['.' + PROPS.SCOPE]: field.conf?.scoped === true ? field : undefined
    }

    if(__IS_TEST__ === true){
      props.id = `preview_${field.name}`
    }

    const content = function(){
      return renderItem(field, options)
    }

    const children = function(){
      const operate = renderOperate(field)
      const cover = <div class="xform-preview-cover" onClick={chooseField.bind(null, field)}/>
      return [content(), operate, cover]
    }

    if(isFunction(options.renderPreivew)) return options.renderPreivew(tag, props, children, content)
    return h(tag, props, children())
  }

  function renderPreviewList(fields: FormField[]){
    const content = (
      fields.length == 0 
        ? renderEmptyTip() 
        : fields.map(field => renderField(field))
    )

    const props = {
      'ref': 'list',
      'class': ['xform-designer-list', CLASS.DROPPABLE],
      ['.' + PROPS.SCOPE]: schemaRef.value
    }

    return (
      <div class="xform-designer-responsive xform-is-pc xform-is-scroll" ref="scroll">
        <div {...props}>{content}</div>
      </div>
    )
  }

  return {
    renderFieldPanel,
    renderSetting,
    renderPreviewList,
    resetSelectedField,
    updateSchema,
    chooseField,
    context: {
      type: 'designer',
      renderField,
      updateField,
      chooseField,
      emit: instance.emit
    } as FormDesignerContext
  }
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
      type: FormSchema,
      required: true
    }
  },
  emits: [
    EVENTS.UPDATE_SCHEMA,
    EVENTS.REMOVE,
    EVENTS.MESSAGE
  ],
  setup(props, { emit, expose }){
    const schemaRef = toRef(props, 'schema') as Ref<FormSchema>
    const modeRef = toRef(props, 'mode') as Ref<string>
    const instance = getCurrentInstance()
    const rc = useRenderContext(instance, schemaRef, modeRef)
    const { dragstart } = useDragging()

    if(Store.getConfig().logic === true) {
      useLogic(schemaRef, (data: any) => emit(EVENTS.MESSAGE, data))
    }
    
    provide(XFORM_SCHEMA_PROVIDE_KEY, toRef(props, 'schema'))
    provide<FormDesignerContext>(XFORM_CONTEXT_PROVIDE_KEY, rc.context)

    const doScroll = function(event: WheelEvent){
      const { pixelY } = normalizeWheel(event)
      const scroll = instance.refs.scroll as HTMLElement
  
      scroll.scrollTop += pixelY
    }

    expose({
      resetSelectedField: rc.resetSelectedField,
      updateSchema: rc.updateSchema,
      chooseField: rc.chooseField
    })
 
    return function(){
      const slots = instance.slots
      const fields = toArray<FormField>(schemaRef.value.fields)

      return (
        <div class="xform-designer" ref="root" onMousedown={dragstart}>
          <div class="xform-designer-panel">
            { rc.renderFieldPanel(Store.findFieldGroups(modeRef.value)) }
          </div>
          <div class="xform-designer-main">
            { isFunction(slots.tool) && slots.tool() }
            <div class="xform-designer-board">
              { rc.renderPreviewList(fields) }
            </div>
          </div>
          <div class="xform-designer-setting">
            { rc.renderSetting(schemaRef.value) }
          </div>
          <div ref="ghost" key="xform-designer-ghost" class="xform-designer-ghost" onWheel={doScroll}>
            <div class="xform-designer-ghost-template" ref="template"/>
            <div class="xform-designer-cover"/>
          </div>
          <div ref="mark" key="xform-designer-mark" class="xform-designer-mark"><hr/></div>
        </div>
      )
    }
  }

})