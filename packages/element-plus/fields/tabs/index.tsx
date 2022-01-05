import './index.scss'

import { 
  defineComponent,
  ref,
  watch,
  onBeforeUnmount,
} from 'vue'

import {
  useRenderContext,
  FormField,
  Field,
  useConstant,
} from '@dongls/xform'

import { useFieldProp } from '@element-plus/util'
import icon from '@common/svg/tabs.svg'
import pane from './pane'
import FieldSetting from '@element-plus/FieldSetting.vue'

const { CLASS, EnumValidityState, EVENTS, EnumRenderType } = useConstant()

const setting = defineComponent({
  name: 'xform-el-tabs-setting',
  props: {
    field: {
      type: FormField,
      required: true,
    },
  },
  emits: [ EVENTS.UPDATE_FIELD ],
  setup(props) {
    const hideTitleRef = useFieldProp('hideTitle', 'attributes')

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
          <div class="xform-el-setting-option xform-el-tabs-option">
            <el-input placeholder="请输入标签名称" v-model={f.title}/>
            <el-button type="primary" link onClick={up.bind(null, index)} disabled={index == 0}>上移</el-button>
            <el-button type="primary" link onClick={down.bind(null, index)} disabled={index == length - 1}>下移</el-button>
            <el-button type="danger" link onClick={removeTab.bind(null, f)} disabled={length <= 1}>删除</el-button>
          </div>
        )
      })

      const slots = {
        default: () => (
          <div class="xform-el-field-setting-prop">
            <header>标签：</header>
            {tabs}
            <el-button type="primary" onClick={addTab} link>添加标签</el-button>
          </div>
        ),
        attributes: () => <el-checkbox name={`${field.name}-hide-title`} v-model={hideTitleRef.value} title="勾选则不显示标题">隐藏标题</el-checkbox>
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

const build = defineComponent({
  name: 'xform-el-tabs',
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
    const rc = useRenderContext()

    onBeforeUnmount(watch(props.field.fields, (fields) => {
      if (fields.every((f) => f.name != current.value)) {
        current.value = fields[fields.length - 1].name
      }
    }))

    return function () {
      const field = props.field
      const value = field.value ?? {}
      const disabled = props.disabled
      const showTitle = field.attributes.hideTitle !== true
      const inDesigner = props.behavior == EnumRenderType.DESIGNER || rc.type == EnumRenderType.DESIGNER

      const panes = field.fields.map(f => {
        return (
          <el-tab-pane label={f.title} name={f.name} lazy>{
            rc.renderField(inDesigner ? f : value[f.name], {
              parentProps: { disabled },
              renderPreivew: (c, p, ch, content) => content()
            })
          }</el-tab-pane>
        )
      })

      const _p ={
        'class': {
          'xform-item': true,
          'xform-el-tabs': true,
          'xform-is-with-title': showTitle,
          [CLASS.IS_ERROR]: field.invalid,
        },
        style: (
          showTitle 
            ? { '--xform-el-tabs-field-title': `"${field.title}"` } as any 
            : null
        )
      }

      return (
        <div {..._p}>
          <el-tabs v-model={current.value} type="border-card">{panes}</el-tabs>
          {renderMessage(field)}
        </div>
      )
    }
  },
})

export default Field.create({
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
  // operators: false
})
