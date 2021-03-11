import { createVNode, defineComponent, Fragment } from 'vue'
import { 
  XField,
  XFieldConf,
  XFormViewerContext,
  constant,
  useRenderContext,
  useSchema,
  useValue,
} from '@dongls/xform'

import { updateField } from '../util'
import icon from '@common/svg/subform.svg'

type RowCell = {[prop: string]: XField}
type Row = Array<RowCell>
const { CLASS, PROPS, EVENTS, EnumValidateMode } = constant
const BODY_CLASS = 'xform-bs-subform-columns'
const DEF_COLUMN_WIDTH = 150

const setting = defineComponent({
  name: 'xform-bs-subform-setting',
  props: {
    field: {
      type: XField,
      required: true
    }
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(props, { emit }){
    function updateColWidth(event: Event, key: string){
      const target = event.target as HTMLInputElement
      const value = parseFloat(target.value)
      const colWidths = props.field.attributes.colWidths
      colWidths[key] = isNaN(value) ? null : value
      emit(EVENTS.UPDATE_FIELD, { prop: 'colWidths', value: colWidths, scope: 'attributes' })
    }
    
    return function(){
      const field = props.field
      const fields = field.fields
      return (
        <Fragment>
          <h3 class="xform-setting-head">子表单</h3>
          <section class="xform-setting">
            <header>标题：</header>
            <input
              value={field.title}
              type="text"
              class="form-control form-control-sm"
              placeholder="请输入标题..."
              onInput={e => updateField(emit, e, 'title')}
            />
          </section>
          <section class="xform-setting">
            <header>列宽：</header>
            {fields.map(f => {
              return (
                <div class="xform-setting-row">
                  <label>{f.title}</label>
                  <div class="xform-setting-row-content">
                    <input 
                      type="number"
                      placeholder={`[数字] 默认宽度${DEF_COLUMN_WIDTH}`}
                      class="form-control form-control-sm"
                      value={field.attributes.colWidths[f.name]}
                      onInput={e => updateColWidth(e, f.name)}
                    />
                  </div>
                </div>
              )
            })}
          </section>
        </Fragment>
      )
    }
  }
})

const preview = defineComponent({
  name: 'xform-bs-subform-preview',
  props: {
    field: {
      type: XField,
      required: true,
    }
  },
  setup(props){
    const rc = useRenderContext()

    return function(){
      const field = props.field
      const fields = field.fields
      const colWidths = field.attributes.colWidths
      const content = (
        fields.length == 0 
          ? <p class={`${CLASS.IS_EMPTY_TIP} xform-bs-empty-tip`}>请将左侧控件拖动到此处</p>
          : (
            fields.map(f => {
              return rc.renderField(f, { 
                renderItem(){
                  const klass = {
                    'xform-bs-subform-cell': true,
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
        [PROPS.XFIELD]: props.field,
        [PROPS.SCOPE]: props.field
      }
      
      return (
        <div class={`xform-bs-subform ${CLASS.IS_VERTICAL_MARK} ${CLASS.IS_SCROLL}`}>
          <div {..._p}>{content}</div>
        </div>
      )
    }
  }
})

const subform = defineComponent({
  name: 'xform-bs-subform',
  props: {
    field: {
      type: XField,
      required: true,
    }
  },
  emits: [EVENTS.UPDATE_VALUE],
  setup(props){
    const rc = useRenderContext()
    const value = useValue<Row>(props)

    function addRow(){
      const row = props.field.fields.reduce((acc, f) => {
        acc[f.name] = f.clone(true, null)
        return acc
      }, {} as any)

      const v = value.value
      v.push(row)
      value.value = v
    }

    function removeRow(row: any){
      const v = value.value
      const index = v.indexOf(row)
      if(index >= 0){
        v.splice(index, 1)
        value.value = v
      }
    }

    return function(){
      const columns = props.field.fields
      if(columns.length == 0){
        return <div class="xform-is-unknown">请放入至少一个字段</div>
      }

      let total = 60
      const colWidths = props.field.attributes.colWidths
      const cols = columns.map(column => {
        const width = colWidths[column.name] ?? DEF_COLUMN_WIDTH
        total += width
        const style = { width: `${width}px` }
        return <col style={style}></col>
      })

      const rows = value.value.map(((row, index) => {
        const tds = columns.map(column => {
          const cell = rc.renderField(row[column.name], {
            renderItem(component, props, children){
              props.label = false
              return createVNode(component, props, children)
            }
          })
          return <td>{cell}</td>
        })

        return (
          <tr class="xform-bs-subform-row">
            <td class="xform-bs-subform-operate">
              <strong>{index + 1}</strong>
              <button type="button" class="btn btn-link text-danger" onClick={removeRow.bind(null, row)}>删除</button>
            </td>
            {tds}
          </tr>
        )
      }))

      const tip = (
        rows.length > 0 
          ? null 
          : <tr>
            <td colspan={columns.length + 1} class="xform-bs-subform-tip">
              <span>点击</span>
              <button type="button" class="btn btn-link btn-sm shadow-none " onClick={addRow}>+ 添加</button>
              <span>按钮插入数据</span>
            </td>
          </tr>
      )

      return (
        <div class="xform-bs-subform">
          <div class="table-responsive">
            <table class="table table-hover" style={{ width: total + 'px' }}>
              <colgroup><col style="width: 60px"></col>{cols}</colgroup>
              <thead>
                <th class="xform-bs-subform-operate">#</th>
                {columns.map(column => {
                  const klass = {
                    'xform-bs-subform-cell': true,
                    'xform-is-required': column.required
                  }
                  return <th class={klass}><span>{column.title}</span></th>
                })}
              </thead>
              <tbody>{rows}{tip}</tbody>
            </table>
          </div>
          <button type="button" class="btn btn-link btn-sm shadow-none" onClick={addRow}>+ 添加</button>
        </div>
      )
    }
  }
})

const view = defineComponent({
  name: 'xform-bs-subform-view',
  props: {
    field: {
      type: XField,
      required: true,
    }
  },
  setup(props){
    const value = useValue<Row>(props)
    const rc = useRenderContext<XFormViewerContext>()
    const schema = useSchema()

    return function(){
      const columns = props.field.fields
      if(!Array.isArray(value.value) || value.value.length == 0 || columns.length == 0){
        return <span class="xform-viewer-value">{schema.value.viewerPlaceholder}</span>
      }

      let total = 60
      const colWidths = props.field.attributes.colWidths
      const cols = columns.map(column => {
        const width = colWidths[column.name] ?? DEF_COLUMN_WIDTH
        total += width
        const style = { width: `${width}px` }
        return <col style={style}></col>
      })

      const rows = value.value.map((row, index) => {
        const cells = columns.map(column => {
          const options = { renderItem: (c: any, p: any, ch: any) => ch() }
          return <td>{ rc.renderField(row[column.name], options) }</td>
        })

        const opreate = <td class="xform-bs-subform-operate"><strong>{index + 1}</strong></td>
        return <tr>{opreate}{cells}</tr>
      })

      return (
        <div class="xform-bs-subform">
          <div class="table-responsive">
            <table class="table table-hover" style={{ width: total + 'px' }}>
              <colgroup><col style="width: 60px"></col>{cols}</colgroup>
              <thead>
                <th class="xform-bs-subform-operate">#</th>
                {columns.map(column => {
                  const klass = {
                    'xform-bs-subform-cell': true,
                    'xform-is-required': column.required
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

export default XFieldConf.create({
  type: 'subform',
  title: '子表单',
  icon,
  accept: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date'],
  setting,
  preview,
  build: subform,
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
    if(init) field.attributes.colWidths = {}
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
      return columns.reduce((row, item: XField) => {
        row[item.name] = item.clone(true, v[item.name] ?? null)
        return row
      }, {} as any)
    })
  },
  onValueSubmit(field){
    if(!Array.isArray(field.value)) return null

    const columns = field.fields
    return field.value.map((row: any) => {
      return columns.map(f => f.name).reduce((acc, key: string) => {
        const f = row[key] as XField
        const onValueSubmit = f.conf?.onValueSubmit
        acc[f.name] = typeof onValueSubmit == 'function' ? onValueSubmit(f) : f.value
        return acc
      }, {} as any)
    })
  },
  validator(field, value: Row, options){
    if(field.required && value.length == 0) return Promise.reject('必填') 
    
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
  }
})