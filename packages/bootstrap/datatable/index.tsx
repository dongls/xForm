import { defineComponent } from 'vue'
import { 
  FormField,
  FieldConf,
  FormViewerContext,
  useRenderContext,
  useSchema,
  isEmpty,
  useConstant,
} from '@dongls/xform'

import icon from '@common/svg/datatable.svg'
import { Row, DEF_COLUMN_WIDTH, BODY_CLASS } from './common'
import { useInlineLayout } from './inline'
import { useModalLayout } from './modal'
import setting from './setting.vue'
import Modal from '../Modal.vue'
import { useValue } from '../util'

const { CLASS, PROPS, EVENTS, EnumValidateMode } = useConstant()
const DEF_INDEX_WIDTH = 60

const preview = defineComponent({
  name: 'xform-bs-datatable-preview',
  props: {
    field: {
      type: FormField,
      required: true,
    }
  },
  setup(props){
    const rc = useRenderContext()

    return function(){
      const field = props.field
      const fields = field.fields
      const colWidths = field.attributes.colWidths ?? {}
      const content = (
        fields.length == 0 
          ? <p class={`${CLASS.IS_EMPTY_TIP} xform-bs-empty-tip`}>请将左侧控件拖动到此处</p>
          : (
            fields.map(f => {
              return rc.renderField(f, { 
                renderItem(){
                  const klass = {
                    'xform-bs-datatable-cell': true,
                    'xform-is-required': f.required
                  }

                  const style = {
                    'width': `${colWidths[f.name] ?? DEF_COLUMN_WIDTH}px`
                  }

                  return <div class={klass} style={style}><span>{f.title}</span></div>
                } 
              })
            })
          )
      )

      const _p = {
        class: `${BODY_CLASS} ${CLASS.DROPPABLE} ${CLASS.SCOPE}`,
        ['.' + PROPS.FIELD]: props.field,
        ['.' + PROPS.SCOPE]: props.field
      }
      
      return (
        <div class={`xform-bs-datatable ${CLASS.IS_VERTICAL_MARK} ${CLASS.IS_SCROLL}`}>
          <div {..._p}>{content}</div>
        </div>
      )
    }
  }
})

const datatable = defineComponent({
  name: 'xform-bs-datatable',
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
  emits: [EVENTS.UPDATE_VALUE],
  setup(props){
    const value = useValue<Row[]>()
    const modalLayout = useModalLayout(props, value)
    const inlineLayout = useInlineLayout(props, value)

    return function(){
      return props.field.attributes.layout == 'inline' ? inlineLayout() : modalLayout()
    }
  },
  components: {
    [Modal.name]: Modal
  }
})

const view = defineComponent({
  name: 'xform-bs-datatable-view',
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
  setup(props){
    const value = useValue<Row[]>()
    const rc = useRenderContext<FormViewerContext>()
    const schema = useSchema()

    return function(){
      const columns = props.field.fields
      if(!Array.isArray(value.value) || value.value.length == 0 || columns.length == 0){
        return <span class="xform-viewer-value">{schema.value.viewerPlaceholder}</span>
      }

      const colWidths = props.field.attributes.colWidths ?? {}
      const { cols, total } = columns.reduce((acc, column) => {
        const width = colWidths[column.name] ?? DEF_COLUMN_WIDTH
        acc.total += width
        acc.cols.push(<col style={`width: ${width}px`}/>)
        return acc
      }, { cols: [], total: DEF_INDEX_WIDTH })

      const rows = value.value.map((row, index) => {
        const cells = columns.map(column => {
          return <td>{ 
            rc.renderField(row[column.name], {
              parentProps: { disabled: props.disabled },
              renderItem: (c: any, p: any, ch: any) => ch(), 
            }) 
          }</td>
        })

        const opreate = <td class="xform-bs-datatable-index"><strong>{index + 1}</strong></td>
        return <tr>{opreate}{cells}</tr>
      })

      return (
        <div class="xform-bs-datatable xform-bs-datatable-view">
          <div class="table-responsive">
            <table class="table table-hover" style={{ width: total + 'px' }}>
              <colgroup>
                <col style={`width: ${DEF_INDEX_WIDTH}px`}></col>
                {cols}
              </colgroup>
              <thead>
                <th class="xform-bs-datatable-index">#</th>
                {columns.map(column => {
                  const klass = {
                    'xform-bs-datatable-cell': true,
                    'xform-is-required': !props.disabled && !column.disabled && column.required
                  }
                  return <th class={klass}><span>{column.title}</span></th>
                })}
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      )
    }
  }
})

export default FieldConf.create({
  type: 'datatable',
  title: '数据表格',
  icon,
  accept: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date'],
  setting,
  preview,
  build: datatable,
  view,
  onDragOver(event) {
    const current = event.currentTarget
    if(!current.matches('.' + BODY_CLASS)) return
    
    event.stopPropagation()
    event.preventDefault()

    const { directionX, moveMarkEl, getRootScopeEl } = event.context
    const isMockDef = event.dragElement.contains(current)
    const target = isMockDef ? event.dragElement : event.target
    const scope = isMockDef ? getRootScopeEl() : current
    moveMarkEl(directionX, target, scope)
  },
  onDrop(event) {
    event.stopPropagation()
  },
  onCreate(field, params, init){
    if(init) {
      field.attributes.colWidths = {}
      field.attributes.layout = 'modal'
    }
  },
  onSubmit(data){
    const colWidths = data.attributes?.colWidths ?? {}
    const keys = data.fields.map((f: any) => f.name)
    for(const key in colWidths){
      if(keys.indexOf(key) < 0) delete colWidths[key]
    }
    return data
  },
  onValueInit(field, value: unknown){
    if(!Array.isArray(value)) return []
    
    const columns = field.fields
    return value.map((v: any) => {
      return columns.reduce((row, item: FormField) => {
        const newField = item.clone(true)
        newField.setValue(v[item.name] ?? null)
        newField.setParent(field)
        row[item.name] = newField
        return row
      }, {} as any)
    })
  },
  onValueSubmit(field){
    if(!Array.isArray(field.value)) return null

    const columns = field.fields
    return field.value.map((row: any) => {
      return columns.map(f => f.name).reduce((acc, key: string) => {
        const f = row[key] as FormField
        const onValueSubmit = f.conf?.onValueSubmit
        acc[f.name] = typeof onValueSubmit == 'function' ? onValueSubmit(f) : f.value
        return acc
      }, {} as any)
    })
  },
  validator(field, value: Row[], options){
    if(field.required && isEmpty(value)) return Promise.reject('必填')

    const promise = value
      .reduce((acc, item) => acc.concat(Object.values(item)), [])
      .map(f => {
        if(options.mode == EnumValidateMode.RECURSIVE){
          return f.validate({ mode: EnumValidateMode.RECURSIVE })
        }
        return f.invalid ? Promise.reject() : Promise.resolve()
      })

    return Promise.allSettled(promise).then(r => {
      return r.some(i => i.status === 'rejected') ? Promise.reject('请补全必填内容') : Promise.resolve()
    })
  },
  onValidate(field: FormField){
    if(isEmpty(field.title)) return Promise.reject('标题为空')
    return field.fields.length == 0 ? Promise.reject('至少需要一个字段') : Promise.resolve()
  },
  operators: false
})