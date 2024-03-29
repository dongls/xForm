import { getCurrentInstance, ref, Ref, onBeforeUnmount, h } from 'vue'
import {
  FormField,
  FormSchema,
  useSchema,
  useRenderContext,
} from '@dongls/xform'

import { DEF_COLUMN_WIDTH, Row } from './common'

const DEF_OPERATE_WIDTH = 100
const DEF_INDEX_WIDTH = 60

function createModel(fields: FormField[], row: Row){
  if(row == null) return {}

  return fields.reduce((acc, f) => {
    const field = row[f.name]
    const onValueSubmit = field.conf?.onValueSubmit
    acc[f.name] = typeof onValueSubmit == 'function' ? onValueSubmit(field) : field.value
    return acc
  }, {} as any)
}

export function useModalLayout(props: { field: FormField, disabled: boolean }, value: Ref<Row[]>){
  const show = ref(false)
  const instance = getCurrentInstance()
  const rootSchema = useSchema()
  const formSchema = ref<FormSchema>(null)
  const rc = useRenderContext()

  let currentRow = null as Row

  onBeforeUnmount(() => {
    formSchema.value = null
    currentRow = null
  })

  function showEditModal(row?: Row){
    currentRow = row
    showModal()
  }

  function showInsertModal(){
    currentRow = null
    showModal()
  }

  function updateShow(v: boolean){
    show.value = v
  }

  function showModal(){
    const model = createModel(props.field.fields, currentRow)
    const fields = props.field.fields.map(f => f.clone(true))
    
    formSchema.value = rootSchema.value.genSchema({ fields }, model)
    show.value = true
  }

  function closeModal(){
    show.value = false
  }

  function submit(){
    const form = instance.refs.form as any
    if(form == null) return closeModal()

    form.validate().then((r: { valid: boolean, model?: any }) => {
      if(!r.valid) return

      currentRow == null ? addRow(r.model) : editRow(r.model)
      closeModal()
    })
  }

  function addRow(model: any){
    const row = props.field.fields.reduce((acc, f) => {
      const newField = f.clone(true)
      newField.setValue(model[f.name])
      newField.setParent(props.field)
      acc[f.name] = newField
      return acc
    }, {} as any)

    const v = value.value
    v.push(row)
    value.value = v
  }

  function editRow(model: any){
    props.field.fields.forEach(f => {
      const key = f.name
      const field = currentRow[key]
      field.value = model[key]
    })
    currentRow = null
  }

  function removeRow(row: any){
    const v = value.value
    const index = v.indexOf(row)
    if(index >= 0){
      v.splice(index, 1)
      value.value = v
    }
  }

  function createTip(rows: number, disabled: boolean, width: number){
    if(rows > 0) return null
    if(disabled) return <div class="xform-bs-datatable-tip" style={`width: ${width}px`}>暂无数据</div>
  
    return (
      <div class="xform-bs-datatable-tip" style={`width: ${width}px`}>
        <span>点击</span>
        <button type="button" class="btn btn-link btn-text btn-sm shadow-none" onClick={showInsertModal}>+ 添加</button>
        <span>按钮插入数据</span>
      </div>
    )
  }

  return function(){
    const columns = props.field.fields.filter(f => f.hidden !== true)
    if(columns.length == 0){
      return <div class="xform-is-unknown">请放入至少一个字段</div>
    }

    const disabled = props.disabled || props.field.disabled
    const colWidths = props.field.attributes.colWidths ?? {}
    const { cols, total } = columns.reduce((acc, column) => {
      const width = colWidths[column.name] ?? DEF_COLUMN_WIDTH
      acc.total += width
      acc.cols.push(<col style={{ width: `${width}px` }}/>)
      return acc
    }, { cols: [], total: DEF_INDEX_WIDTH })

    const rows = value.value.map((row, index) => {
      const tds = columns.map(column => {
        const f = row[column.name]
        const cell = rc.renderField(f, {
          parentProps: { disabled },
          renderItem(component, props){
            props.custom = true
            return h(component, props, () => f.value ?? rootSchema.value.viewerPlaceholder)
          }
        })
        return <td>{cell}</td>
      })

      const operate = disabled ? null : (
        <td class="xform-bs-datatable-operate">
          <button type="button" class="btn btn-link btn-text shadow-none" onClick={showEditModal.bind(null, row)}>编辑</button>
          <button type="button" class="btn btn-link btn-text text-danger shadow-none" onClick={removeRow.bind(null, row)}>删除</button>
        </td>
      )
      
      return (
        <tr class="xform-bs-datatable-row">
          <td class="xform-bs-datatable-index">{index + 1}</td>
          {tds}
          {operate}
        </tr>
      )
    })

    const width = total + (disabled ? 0 : DEF_OPERATE_WIDTH)
    const button = disabled ? '#' : <button type="button" class="btn btn-sm btn-link btn-text shadow-none" onClick={showInsertModal}>添加</button>
    const table = (
      <table class="table table-hover" style={`width: ${width}px`}>
        <colgroup>
          <col style={`width: ${DEF_INDEX_WIDTH}px`}/>
          {cols}
          {disabled ? null : <col style={`width: ${DEF_OPERATE_WIDTH}px`}/>}
        </colgroup>
        <thead>
          <th class="xform-bs-datatable-index">{button}</th>
          {columns.map(column => {
            const klass = {
              'xform-bs-datatable-cell': true,
              'xform-is-required': !disabled && !column.disabled && column.required
            }
            return <th class={klass}><span>{column.title}</span></th>
          })}
          {disabled ? null : <th class="xform-bs-datatable-operate">操作</th>}
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )

    return (
      <div class="xform-bs-datatable" data-layout="modal">
        <div class="table-responsive">
          {table}
          {createTip(rows.length, disabled, width)}
        </div>
        <modal
          title={`${currentRow == null ? '添加' : '编辑'}数据`}
          class="xform-bs-datatable-modal-layout"
          onConfirm={submit}
          {...{ visible: show.value, 'onUpdate:visible': updateShow }}
        >
          <xform-builder schema={formSchema.value} ref="form" onSubmit={submit}>
            <button class="xform-is-hidden" type="submit"/>
          </xform-builder>
        </modal>
      </div>
    )
  }
}
