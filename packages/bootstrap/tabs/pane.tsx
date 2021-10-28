import { defineComponent } from 'vue'

import {
  FormField,
  FieldConf,
  useRenderContext,
  useConstant,
} from '@dongls/xform'

const { SELECTOR, CLASS, PROPS, EnumValidateMode } = useConstant()

export default FieldConf.create({
  type: 'tabs.pane',
  title: '标签面板',
  custom: true,
  scoped: true,
  build: defineComponent({
    name: 'tabs-pane',
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
      return function () {
        const context = useRenderContext()
        const fields = props.field.fields
        const value = props.field.value ?? {}
        const inDesigner = props.behavior == 'designer'

        const content = (
          props.behavior == 'designer' && fields.length == 0 
            ? <p class={[CLASS.IS_EMPTY_TIP, 'xform-bs-empty-tip']}>请将左侧控件拖动到此处</p>
            : fields.map((f) => context.renderField(inDesigner ? f : value[f.name], { parentProps: { disabled: props.disabled } }))
        )

        const _p = {
          class: {
            'tab-pane': true,
            [CLASS.DROPPABLE]: true,
            [CLASS.SCOPE]: true
          },
          ['.' + PROPS.FIELD]: props.field,
          ['.' + PROPS.SCOPE]: props.field
        }

        return <div {..._p}>{content}</div>
      }
    },
  }),
  view: defineComponent({
    name: 'tabs-pane-view',
    props: {
      field: {
        type: FormField,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const context = useRenderContext()
      const value = props.field.value ?? {}

      return function () {
        const fields = props.field.fields
        return (
          <div class="tab-pane">
            {fields.map((f) => context.renderField(value[f.name], { parentProps: { disabled: props.disabled } }))}
          </div>
        )
      }
    },
  }),
  onDragOver(event) {
    const current = event.currentTarget
    
    event.stopPropagation()
    event.preventDefault()

    const { directionY, moveMarkEl } = event.context
    // 处理拖拽外层字段
    const isMockDef = event.dragElement.contains(current)
    const target = isMockDef ? event.dragElement : event.target
    const scope = isMockDef ? event.dragElement.parentElement.closest(SELECTOR.DROPPABLE) : current

    moveMarkEl(directionY, target, scope)
  },
  onDrop(event) {
    event.stopPropagation()
  },
  onValueInit(field, _value){
    const value = _value ?? {}
    return field.fields.reduce((acc, f) => {
      const k = f.name
      const newField = f.clone(true)
      newField.setValue(value[k] ?? null)
      newField.setParent(field)
      acc[k] = newField
      return acc
    }, {} as any)
  },
  onValueSubmit(field){
    const value = field.value ?? {}

    return field.fields.map(f => f.name).reduce((acc: any, k: string) => {
      const f = value[k] as FormField
      const onValueSubmit = f.conf?.onValueSubmit
      acc[k] = typeof onValueSubmit == 'function' ? onValueSubmit(f) : f.value
      return acc
    }, {} as any)
  },
  validator(field, value, options){
    const promise = Object.values(value ?? {}).map((f: FormField) => {
      if(options.mode == EnumValidateMode.RECURSIVE){
        return f.validate({ mode: EnumValidateMode.RECURSIVE })
      }
      return f.invalid ? Promise.reject() : Promise.resolve()
    })
    
    return Promise.allSettled(promise).then(r => {
      return r.some(i => i.status === 'rejected') ? Promise.reject(`请补全标签页[${field.title}]必填内容`) : Promise.resolve()
    })
  }
})
