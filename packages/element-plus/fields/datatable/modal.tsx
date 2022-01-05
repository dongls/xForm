import { getCurrentInstance, ref, Ref, onBeforeUnmount, h, Fragment } from 'vue'
import {
  FormField,
  FormSchema,
  useSchema,
  useRenderContext,
  FormBuilderApi
} from '@dongls/xform'

import { DEF_COLUMN_WIDTH, Row } from './common'

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

  function showDialog(row?: Row){
    currentRow = row

    const model = createModel(props.field.fields, currentRow)
    const fields = props.field.fields.map(f => f.clone(true))
    
    formSchema.value = rootSchema.value.genSchema({ fields }, model)
    show.value = true
  }

  function closeDialog(){
    show.value = false
  }

  function submit(){
    const form = instance.refs.form as FormBuilderApi
    if(form == null) return closeDialog()

    form.validate().then(r => {
      if(!r.valid) return

      currentRow == null ? addRow(r.model) : editRow(r.model)
      closeDialog()
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

  return function(){
    const columns = props.field.fields.filter(f => f.hidden !== true)
    if(columns.length == 0){
      return <div class="xform-is-unknown">请放入至少一个字段</div>
    }

    const disabled = props.disabled || props.field.disabled
    const colWidths = props.field.attributes.colWidths ?? {}
    const tableSlots = {
      default(){
        const indexSlots = {
          header(){
            return (
              disabled 
                ? '#' 
                : (
                  <el-button 
                    onClick={showDialog.bind(null, null)} 
                    type="primary" size="small" link 
                  >添加</el-button>
                )
            )
          }
        }

        const operateSlots = {
          default(scope: { row: Row }){
            return [
              (
                <el-button 
                  onClick={showDialog.bind(null, scope.row)}
                  type="primary" size="small" link
                >编辑</el-button>
              ),
              (
                <el-button 
                  onClick={removeRow.bind(null, scope.row)}
                  type="danger" size="small" link
                >删除</el-button>
              )
            ]
          }
        }

        const cols = columns.map(column => {
          const width = colWidths[column.name] ?? DEF_COLUMN_WIDTH
          const slots = {
            default(scope: { row: Row }){
              const f = scope.row[column.name]
              return rc.renderField(f, {
                parentProps: { disabled },
                renderItem(component, props){
                  props.custom = true
                  return h(component, props, () => f.value ?? rootSchema.value.viewerPlaceholder)
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
          <el-table-column type="index" fixed="left" width="60px" v-slots={indexSlots}/>,
          ...cols,
          disabled ? null : <el-table-column label="操作" fixed="right" width="100px" aligh="right" v-slots={operateSlots}/>
        ]
      }
    }

    const dialogSlots = {
      default(){
        if(!show.value) return null

        return (
          <xform-builder schema={formSchema.value} ref="form" onSubmit={submit}>
            <button class="xform-is-hidden" type="submit"/>
          </xform-builder>
        )
      },
      footer(){
        return (
          <div>
            <el-button onClick={closeDialog}>取消</el-button>
            <el-button type="primary" onClick={submit}>确定</el-button>
          </div>
        )
      }
    }

    const klass = {
      'xform-el-datatable': true,
      'xform-el-datatable-is-empty': value.value.length == 0
    }
    const title = `${currentRow == null ? '添加' : '编辑'}数据`
  
    return (
      <Fragment>
        <el-table 
          v-slots={tableSlots}
          class={klass} size="small" 
          data-layout="modal"
          data={value.value}
        />
        <el-dialog 
          v-model={show.value} 
          v-slots={dialogSlots} 
          title={title}
          custom-class="xform-el-datatable-dialog" 
          append-to-body
        />
      </Fragment>
    )
  }
}
