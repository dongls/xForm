import { toArray } from '../util'
import { Action, FieldInsertAction, FieldMoveAction, FieldRemoveAction } from './action'
import { Serializable } from './Serializable'

export abstract class FormScope extends Serializable{
  parent?: FormScope
  fields: FormScope[] = []

  constructor(){
    super()

    Reflect.defineProperty(this, 'parent', {
      value: null,
      writable: true
    })
  }

  abstract get root(): FormScope
  abstract get model(): any
  abstract previous(): FormScope[]
  abstract find(name: string): FormScope
  abstract dispatch(action: Action): void

  insert(index: number, field: FormScope){
    this.fields.splice(index, 0, field)
    field.parent = this

    const action: FieldInsertAction = {
      type: 'field.insert',
      field: field as any,
      index
    }

    this.dispatch(action)
  }

  push(field: FormScope){
    const index = this.fields.length
    this.fields.push(field)
    field.parent = this

    const action: FieldInsertAction = {
      type: 'field.insert',
      field: field as any,
      index
    }
    this.dispatch(action)
  }

  remove(fieldOrIndex: FormScope | number){
    const index = normalizeIndex(this, fieldOrIndex)
    if(index < 0) return

    const field = this.fields.splice(index, 1)[0]
    const parent = field.parent
    field.parent = null

    const action: FieldRemoveAction = {
      type: 'field.remove',
      field: field as any,
      index,
      oldParent: parent as any
    }

    this.dispatch(action)
  }

  /** 把字段从当前位置移动到一个新的位置 */
  move(target: number){
    const parent = this.parent
    if(parent == null) return

    const a = parent.indexOf(this)
    const b = target

    if(a < 0 || b < 0 || a == b) return

    const item = parent.fields.splice(a, 1)[0]
    parent.fields.splice(b, 0, item)

    const action: FieldMoveAction = {
      type: 'field.move',
      field: this as any,
      oldIndex: a,
      newIndex: b
    }

    this.dispatch(action)
  }

  indexOf(field: FormScope){
    return this.fields.indexOf(field)
  }

  contains(field: FormScope){
    return this.indexOf(field) >= 0
  }

  createFields(params: any, creator: (param: any) => FormScope){
    const origin = toArray(params)
    origin.forEach(o => {
      const f = creator(o)
      f.parent = this
      this.fields.push(f)
    })
  }

  clear(){
    if(!Array.isArray(this.fields) || this.fields.length == 0) return
    
    this.fields.forEach(field => {
      field.parent = null
      field.clear()
    })
  
    this.fields = []
  }

  setParent(parent: FormScope){
    this.parent = parent
  }

  destroy(){
    this.fields.forEach(f => f.destroy())
    this.parent = null
    this.fields = null
  }
}

function normalizeIndex(scope: FormScope, fieldOrIndex: FormScope | number){
  if(typeof fieldOrIndex == 'number') return fieldOrIndex < scope.fields.length ? fieldOrIndex : -1
  if(fieldOrIndex instanceof FormScope) return scope.fields.indexOf(fieldOrIndex)
  return -1
}