import { h, Ref } from 'vue'
import { useRenderContext, FormField } from '@dongls/xform'
import { DEF_COLUMN_WIDTH, Row } from './common'


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

  return function(){
    const columns = props.field.fields.filter(f => f.hidden !== true)
    if(columns.length == 0){
      return <div class="xform-is-unknown">请放入至少一个字段</div>
    }
    
    const disabled = props.disabled || props.field.disabled
    const slots = {
      default(){
        const indexSlots = {
          default(scope: { $index: number, row: any }){
            return [
              <strong class="xform-el-datatable-row-index">{scope.$index + 1}</strong>,
              disabled ? null : <el-button onClick={removeRow.bind(null, scope.row)} type="text" size="mini" class="xform-el-datatable-remove" auto-insert-space={false}>删除</el-button>
            ]
          },
          header(){
            return (
              disabled ? '#' : <el-button onClick={addRow} type="text" size="mini" class="xform-el-datatable-add" auto-insert-space={false}>添加</el-button>
            )
          }
        }

        const colWidths = props.field.attributes.colWidths ?? {}
        const cols = columns.map(column => {
          const width = colWidths[column.name] ?? DEF_COLUMN_WIDTH
          const slots = {
            default(scope: { row: Row }){
              return rc.renderField(scope.row[column.name], {
                parentProps: { disabled },
                renderItem(component, props, children){
                  props.label = false
                  return h(component, props, children)
                }
              })
            }
          }
    
          return (
            <el-table-column
              prop={column.name}
              label={column.title}
              min-width={width}
              label-class-name={column.required ? 'xform-is-required' : null}
              v-slots={slots}
            />
          )
        })

        return [
          <el-table-column type="index"  fixed="left" width="60px" v-slots={indexSlots}/>,
          ...cols
        ]
      }
    }

    const klass = {
      'xform-el-datatable': true,
      'xform-el-datatable-is-empty': value.value.length == 0
    }
    
    return <el-table data={value.value} v-slots={slots} size="mini" class={klass} data-layout="inline"/>
  }
}
