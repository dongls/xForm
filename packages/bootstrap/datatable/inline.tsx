import { h, Ref } from 'vue'
import { useRenderContext, FormField } from '@dongls/xform'
import { DEF_COLUMN_WIDTH, Row } from './common'

const DEF_INDEX_WIDTH = 60

export function useInlineLayout(props: { field: FormField, disabled: boolean }, value: Ref<Row[]>){
  const rc = useRenderContext()

  function addRow(){
    const row = props.field.fields.reduce((acc, f) => {
      const newField = f.clone(true)
      newField.setParent(props.field)
      acc[f.name] = newField
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

  function createTip(rows: number, disabled: boolean, width: number){
    if(rows > 0) return null
    if(disabled) return <div class="xform-bs-datatable-tip" style={`width: ${width}px`}>暂无数据</div>
  
    return (
      <div class="xform-bs-datatable-tip" style={`width: ${width}px`}>
        <span>点击</span>
        <button type="button" class="btn btn-link btn-text btn-sm shadow-none" onClick={addRow}>+ 添加</button>
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
        const cell = rc.renderField(row[column.name], {
          parentProps: { disabled },
          renderItem(component, props, children){
            props.label = false
            return h(component, props, children)
          }
        })
        return <td>{cell}</td>
      })

      return (
        <tr class="xform-bs-datatable-row">
          <td class="xform-bs-datatable-index">
            <strong>{index + 1}</strong>
            { disabled ? null : <button type="button" class="btn btn-link btn-text text-danger" onClick={removeRow.bind(null, row)}>删除</button> }
          </td>
          {tds}
        </tr>
      )
    })

    const button = disabled ? '#' : <button type="button" class="btn btn-link btn-text btn-sm shadow-none" onClick={addRow}>添加</button>
    return (
      <div class="xform-bs-datatable" data-layout="inline">
        <div class="table-responsive">
          <table class="table table-hover" style={{ width: total + 'px' }}>
            <colgroup>
              <col style={`width: ${DEF_INDEX_WIDTH}px`}/>
              {cols}
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
            </thead>
            <tbody>{rows}</tbody>
          </table>
          {createTip(rows.length, disabled, total)}
        </div>
      </div>
    )
  }
}
