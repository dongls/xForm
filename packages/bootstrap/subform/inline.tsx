import { h, Ref } from 'vue'
import { useRenderContext, XField } from '@dongls/xform'
import { DEF_COLUMN_WIDTH, DEF_INDEX_WIDTH, DEF_OPERATE_WIDTH, Row } from './common'

export function useInlineLayout(props: { field: XField, disabled: boolean }, value: Ref<Row[]>){
  const rc = useRenderContext()

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

  function createTip(rows: number, disabled: boolean, width: number){
    if(rows > 0) return null
    if(disabled) return <div class="xform-bs-subform-tip" style={`width: ${width}px`}>暂无数据</div>
  
    return (
      <div class="xform-bs-subform-tip" style={`width: ${width}px`}>
        <span>点击</span>
        <button type="button" class="btn btn-link btn-sm shadow-none" onClick={addRow}>+ 添加</button>
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
      
      const operate = disabled ? null : (
        <td class="xform-bs-subform-operate">
          <button type="button" class="btn btn-link text-danger" onClick={removeRow.bind(null, row)}>删除</button>
        </td>
      )

      return (
        <tr class="xform-bs-subform-row">
          <td class="xform-bs-subform-index">{index + 1}</td>
          {tds}
          {operate}
        </tr>
      )
    })

    const width = total + (disabled ? 0 : DEF_OPERATE_WIDTH)

    return (
      <div class="'xform-bs-subform" data-layout="inline">
        <div class="table-responsive">
          <table class="table table-hover" style={{ width: width + 'px' }}>
            <colgroup>
              <col style={`width: ${DEF_INDEX_WIDTH}px`}/>
              {cols}
              {disabled ? null : <col style={`width: ${DEF_OPERATE_WIDTH}px`}/>}
            </colgroup>
            <thead>
              <th class="xform-bs-subform-operate">#</th>
              {columns.map(column => {
                const klass = {
                  'xform-bs-subform-cell': true,
                  'xform-is-required': !disabled && !column.disabled && column.required
                }
                return <th class={klass}><span>{column.title}</span></th>
              })}
              {disabled ? null : <th class="xform-bs-subform-operate">操作</th>}
            </thead>
            <tbody>{rows}</tbody>
          </table>
          {createTip(rows.length, disabled, width)}
        </div>
        {disabled ? null : <button type="button" class="btn btn-link btn-sm shadow-none" onClick={addRow}>+ 添加</button>}
      </div>
    )
  }
}
