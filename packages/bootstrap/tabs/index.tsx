import './index.scss'
import icon from '@common/svg/tabs.svg'

import { useContext, XField, XFieldConf, normalizeClass, constant } from '@dongls/xform'
import { defineComponent, Fragment, ref, watch } from 'vue'
import { updateField } from '../util'

import pane from './pane'
import { EnumValidityState } from '@model'

const { CLASS, PROPS } = constant

const setting = defineComponent({
  name: 'xform-bs-tabs-setting',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props, { emit }){
    function addTab(){
      const field = props.field
      const tab = new XField(pane)
      tab.title = `标签${props.field.fields.length + 1}`
      field.fields.push(tab)
    }

    function removeTab(f: XField) {
      const fields = props.field.fields
      if(fields.length <= 1) return
      
      const index = fields.indexOf(f)
      if(index >= 0) fields.splice(index, 1)
    }

    function updateTitle(f: XField, event: Event){
      f.title = (event.target as HTMLInputElement).value
    }

    return function(){
      const field = props.field

      const tabs = field.fields.map(f => {
        const disabled = field.fields.length <= 1
        return (
          <div class="xform-bs-setting-option">
            <input type="text" class="form-control form-control-sm" placeholder="请输入标签名称" value={f.title} onInput={updateTitle.bind(null, f)}/>
            <button type="button" class="btn btn-link btn-sm" onClick={removeTab.bind(null, f)} disabled={disabled}>删除</button>
          </div>
        )
      })

      return (
        <Fragment>
          <h3 class="xform-setting-head">选项卡</h3>
          <section class="xform-setting">
            <div class="xform-bs-tabs-setting-title">
              <header>标题：</header>
              <div class="custom-control custom-checkbox">
                <input 
                  type="checkbox" 
                  class="custom-control-input" 
                  id={`${field.name}-show-title`} 
                  name={`${field.name}-show-title`}
                  checked={field.attributes.showTitle}
                  onInput={e => updateField(emit, e, 'showTitle', 'attributes')}
                />
                <label class="custom-control-label" for={`${field.name}-show-title`}>显示标题</label>
              </div>
            </div>
            <input value={field.title} type="text" class="form-control form-control-sm" placeholder="请输入标题..." onInput={updateTitle.bind(null, field)}/>
          </section>

          <div class="xform-setting">
            <header>标签：</header>
            {tabs}
            <button type="button" class="btn btn-link btn-sm" onClick={addTab}>添加标签</button>
          </div>
        </Fragment>
      )
    }
  }
})

function renderMessage(field: XField){
  if(field.validation.valid !== EnumValidityState.ERROR) return null

  return <p class="xform-item-message">{field.validation.message}</p>
}

const build = defineComponent({
  name: 'tabs',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  setup(props){
    const current = ref(props.field.fields[0].name)

    function chooseTab(field: XField, event: Event){
      event.preventDefault()
      current.value = field.name
    }

    watch(props.field.fields, fields => {
      if(fields.every(f => f.name != current.value)){
        current.value = fields[fields.length - 1].name
      }
    })

    return function(){
      const context = useContext()
      const field = props.field
      const tabs = field.fields.map(f => {
        const className = {
          'nav-link': true,
          'active': current.value == f.name
        }

        return <a class={className} href="javascript:;" onClick={chooseTab.bind(null, f)}>{f.title}</a>
      })

      const content = field.fields.map(f => {
        return context.renderField(f, props => {
          const klass = normalizeClass(props.class)
          klass[CLASS.DROPPABLE] = true
          klass[CLASS.SCOPE] = true
          klass.active = current.value == f.name
          props.class = klass
          props[PROPS.SCOPE] = f
          props[PROPS.XFIELD] = f

          return props
        }, false)
      })

      const tabClassName = {
        'xform-item': true,
        'xform-bs-tabs': true,
        [CLASS.IS_ERROR]: field.validation.valid === EnumValidityState.ERROR
      }

      return (
        <div class={tabClassName}>
          <div class="nav nav-tabs">
            {field.attributes.showTitle === true && <strong class="nav-tabs-title">{field.title}</strong>}
            {tabs}
          </div>
          <div class="tab-content">{content}</div>
          {renderMessage(field)}
        </div>
      )
    }
  }
})

export default XFieldConf.create({
  type: 'tabs',
  title: '标签页',
  icon,
  custom: true,
  setting: setting,
  build: build,
  view: build,
  dependencies: [pane],
  onCreate(field, params, init){
    if(init){
      const tab = new XField(pane)
      tab.title = `标签${field.fields.length + 1}`
      field.fields.push(tab)
    }
  },
  validator(field){
    const panes = field.fields
      .filter(f => f.validation.valid === EnumValidityState.ERROR)
      .map(i => i.title)
    
    return panes.length > 0 ? Promise.reject(`请补全标签页[${panes.join(',')}]的必填内容`) : Promise.resolve()
  }
})