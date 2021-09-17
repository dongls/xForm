import { 
  defineComponent,
  ref,
  watch,
  h,
  getCurrentInstance,
  onBeforeUnmount,
} from 'vue'

import {
  useRenderContext,
  FormField,
  FieldConf,
  constant,
  normalizeClass,
  normalizeWheel,
  getHtmlElement,
} from '@dongls/xform'

import { updateField } from '../util'
import icon from '@common/svg/tabs.svg'
import pane from './pane'
import FieldSetting from '../FieldSetting.vue'

const { CLASS, EnumValidityState } = constant
const OFFSET_PROP = '__offset__'

const setting = defineComponent({
  name: 'xform-bs-tabs-setting',
  props: {
    field: {
      type: FormField,
      required: true,
    },
  },
  emits: [ constant.EVENTS.UPDATE_FIELD ],
  setup(props, { emit }) {
    function addTab() {
      const field = props.field
      const tab = new FormField(pane)
      tab.title = `标签${props.field.fields.length + 1}`
      field.fields.push(tab)
    }

    function removeTab(f: FormField) {
      const fields = props.field.fields
      if (fields.length <= 1) return

      const index = fields.indexOf(f)
      if (index >= 0) fields.splice(index, 1)
    }

    function updateTitle(f: FormField, event: Event) {
      f.title = (event.target as HTMLInputElement).value
    }

    function up(index: number){
      const fields = props.field.fields
      const item = fields.splice(index, 1)[0]
      fields.splice(index - 1, 0, item)
    }

    function down(index: number){
      const fields = props.field.fields
      const item = fields.splice(index + 1, 1)[0]
      fields.splice(index, 0, item)
    }

    return function () {
      const field = props.field

      const tabs = field.fields.map((f, index) => {
        const length = field.fields.length
        return (
          <div class="xform-bs-setting-option">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="请输入标签名称"
              value={f.title}
              onInput={updateTitle.bind(null, f)}
            />
            <button type="button" class="btn btn-link" onClick={up.bind(null, index)} disabled={index == 0}>上移</button>
            <button type="button" class="btn btn-link" onClick={down.bind(null, index)} disabled={index == length - 1}>下移</button>
            <button type="button" class="btn btn-link text-danger" onClick={removeTab.bind(null, f)} disabled={length <= 1}>删除</button>
          </div>
        )
      })

      const slots = {
        default: () => (
          <div class="xform-bs-field-setting-prop">
            <header>标签：</header>
            {tabs}
            <button type="button" class="btn btn-link btn-sm bs-btn-text" onClick={addTab}>添加标签</button>
          </div>
        ),
        attributes: () => (
          <div class="custom-control custom-checkbox custom-control-inline">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`${field.name}-show-title`}
              name={`${field.name}-show-title`}
              checked={field.attributes.showTitle}
              onInput={(e) => updateField(emit, e, 'showTitle', 'attributes')}
            />
            <label class="custom-control-label" for={`${field.name}-show-title`}>显示标题</label>
          </div>
        )
      }

      return <field-setting field={field} placeholder={false} required={false} v-slots={slots}/>
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})

function renderMessage(field: FormField) {
  if (field.validation.valid !== EnumValidityState.ERROR) return null

  return <p class="xform-item-message">{field.validation.message}</p>
}

function calcOffset(event: WheelEvent, list: HTMLElement, scroll: HTMLElement){
  const r = normalizeWheel(event).pixelY
  const p = (list as any)[OFFSET_PROP] || 0
  const offset = r + p

  if(offset < 0) return 0
  if(offset > list.offsetWidth - scroll.offsetWidth){
    return list.offsetWidth - scroll.offsetWidth
  }

  return offset
}

// TODO: 支持设置默认显示tab
const build = defineComponent({
  name: 'tabs',
  props: {
    field: {
      type: FormField,
      required: true,
    },
    behavior: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const current = ref(props.field.fields[0].name)
    const instance = getCurrentInstance()

    function chooseTab(field: FormField, event: Event) {
      event.preventDefault()
      current.value = field.name
    }

    function scroll(event: WheelEvent){
      const scroll = getHtmlElement(instance.refs, 'scroll')
      const list = getHtmlElement(instance.refs, 'list') as any
      if(list.offsetWidth <= scroll.offsetWidth) return

      event.preventDefault()
      
      const offset = calcOffset(event, list, scroll)
      list[OFFSET_PROP] = offset
      list.style.transform = `translateX(${-offset}px)`
    }

    const stop = watch(props.field.fields, (fields) => {
      if (fields.every((f) => f.name != current.value)) {
        current.value = fields[fields.length - 1].name
      }
    })

    onBeforeUnmount(stop)

    return function () {
      const rc = useRenderContext()
      const field = props.field
      const value = field.value ?? {}
      const title = field.attributes.showTitle === true ? <strong class="nav-tabs-title">{field.title}</strong> : null
      const disabled = props.disabled

      const tabs = field.fields.map((f) => {
        const className = {
          'nav-link': true,
          active: current.value == f.name,
        }

        return <a class={className} href="javascript:;" onClick={chooseTab.bind(null, f)}>{f.title}</a>
      })

      const content = field.fields.map((f) => {
        return rc.renderField(props.behavior == 'designer' ? f : value[f.name], {
          parentProps: { disabled },
          renderContent(component, props){
            props.class = normalizeClass(props.class, {
              active: current.value == f.name,
            })
            return h(component, props)
          },
          renderPreivew: (c, p, ch, content) => content()
        })
      })

      const klass = {
        'xform-item': true,
        'xform-bs-tabs': true,
        [CLASS.IS_ERROR]: field.invalid,
      }

      return (
        <div class={klass}>
          <div class="nav nav-tabs">
            {title}
            <div class="xform-bs-tabs-scroll" onWheel={scroll} ref="scroll">
              <div class="xform-bs-tab-list" ref="list">{tabs}</div>
            </div>
          </div>
          <div class="tab-content">{content}</div>
          {renderMessage(field)}
        </div>
      )
    }
  },
})

export default FieldConf.create({
  type: 'tabs',
  title: '标签页',
  icon,
  custom: true,
  setting: setting,
  build: build,
  view: build,
  dependencies: [pane],
  onCreate(field, params, init) {
    if (init) {
      const tab = new FormField(pane)
      tab.title = `标签${field.fields.length + 1}`
      field.push(tab)
      field.attributes.showTitle = true
    }
  },
  onValueInit(field, _value){
    const value = _value ?? {}

    return field.fields.reduce((acc, f) => {
      const k = f.name
      const newField = f.clone(true)
      newField.setValue(value[k])
      newField.setParent(field)
      acc[k] = newField
      return acc
    }, {} as any)
  },
  onValueSubmit(field){
    const value = field.value ?? {}
    return field.fields.map(f => f.name).reduce((acc, k: string) => {
      const f = value[k] as FormField
      const onValueSubmit = f.conf?.onValueSubmit
      acc[k] = typeof onValueSubmit == 'function' ? onValueSubmit(f) : f.value
      return acc
    }, {} as any)
  },
  validator(field, value, options) {
    const promise = Object.values(value ?? {}).map((f: FormField) => f.validate({ mode: options.mode }))

    return Promise.allSettled(promise).then(r => {
      const reason = r.map(i => i.status == 'rejected' ? i.reason : null).filter(i => i)
      return reason.length > 0 ? Promise.reject(reason.join('\n')) : Promise.resolve()
    })
  },
  operators: false
})
