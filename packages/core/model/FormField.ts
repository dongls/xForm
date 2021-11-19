import { isReactive, reactive } from 'vue'
import { findField, getConfig } from '../api'
import { ValidateFunc, FieldConf } from './FieldConf'
import { Serializable } from './Serializable'
import { LogicRule } from './common'
import { FormScope } from './FormScope'
import { FormSchema } from './FormSchema'
import { 
  createPrivateProps, 
  getIncNum, 
  isFunction, 
  isNull, 
  mixinRestParams 
} from '../util/lang'

import { 
  Action, 
  ValidateAction, 
  ValidChangeAction, 
  ValueChangeAction 
} from './action'

import { 
  EnumValidateMode, 
  EnumValidityState,
  BuiltInDefaultValueType 
} from './constant'

import { genDefaultValue } from '../api/index'

interface PrivateProps{
  value: any;
  valid: EnumValidityState
}

interface Validation {
  // 验证信息
  message: string;
  // 验证是否通过
  valid: EnumValidityState;
  // 是否正在验证
  validating: boolean;
  // 外部验证器
  external: () => boolean | ValidateFunc;
}

// TODO: 支持显示颜色，标签
interface Option { 
  value: string;
  label?: string;
  color?: string;
}

interface Attributes{
  [prop: string]: any 
  // 是否隐藏标题
  hideTitle?: boolean
}

const PRIVATE_PROPS_KEY = Symbol()

/** 
 * 描述字段数据的类，xForm就是用它与后端进行数据交换。
 * 
 * 1. 保存用户对字段的配置数据
 * 2. 保存用户在表单中操作数据
 */
export class FormField extends FormScope{
  [prop: string]: any;
  private props: (key: Symbol) => PrivateProps

  /** 创建时自动生成，全局唯一，不可修改 */
  uid: string
  /** 字段类型，请保证类型唯一 */
  type: string
  /** 字段标识，不唯一 */
  name: string
  /** 字段名称 */
  title?: string

  placeholder?: string
  options?: Option[]

  /* 必填 */
  required?: boolean
  /**
   * 禁用当前字段：
   * - 禁用时，字段本身无法填写
   * - 禁用时，如果存在子字段，那么子字段也被禁用
   * - 禁用时，验证失效
   */
  disabled?: boolean
  /** 隐藏字段 */
  hidden?: boolean

  /** 各字段类型的私有属性都存储在此 */
  attributes?: Attributes
  /** 是否允许字段被删除 */
  allowRemove?: boolean
  /** 是否允许复制字段 */
  allowClone?: boolean
  // eslint-disable-next-line no-use-before-define
  parent?: FormField | FormSchema = null
  /** 子类型, 避免直接修改 */
  // eslint-disable-next-line no-use-before-define
  fields: FormField[] = []
  /** 表单项的值 */
  value: any
  /** 默认值，字段没有填写时生效 */
  defaultValue: {
    type: string,
    value?: any
  }
  /** 逻辑 */
  logic: LogicRule
  /** 表单验证相关属性 */
  validation: Validation

  /** 字段运行时状态 */
  state = {
    // 组件是否挂载
    mounted: false
  }

  static [Serializable.EXCLUDE_PROPS_KEY] = ['validation', 'value', 'state', 'parent', 'props']

  static create(f: any){
    return f instanceof FormField ? f : new FormField(f)
  }

  constructor(o: unknown = {}){
    super()

    const params = this.normalizeParams(o)
    const init = o instanceof FieldConf
    const fc = findField(params.type)
    const props: PrivateProps = { 
      value: undefined,
      valid: EnumValidityState.NONE
    }

    this.type = params.type
    this.name = params.name ?? getConfig().genName(o)
    this.title = params.title
    
    this.placeholder = params.placeholder 
    this.required = params.required === true
    this.disabled = params.disabled === true
    this.hidden = params.hidden === true
    this.options = Array.isArray(params.options) ? params.options : undefined
    this.attributes = params.attributes ?? {}

    this.allowRemove = params.allowRemove
    this.allowClone = params.allowClone
    
    this.defaultValue = createDefaultValue(params.defaultValue)
    this.logic = params.logic

    this.createFields(params.fields, p => FormField.create(p))
    // 创建验证相关值
    createValidation(this, props)
    // 创建表单值
    createValue(this, props)
    // 混入用户自定义属性
    mixinRestParams(this, params)
    // 生成uid
    Object.defineProperty(this, 'uid', { 
      value: 'field__' + getIncNum(),
      enumerable: false,
      writable: false,
      configurable: false
    })
    // 创建私有属性
    this.props = createPrivateProps<PrivateProps>(PRIVATE_PROPS_KEY, props)

    // 调用onCreate hook, 可在此初始化字段
    isFunction(fc?.onCreate) && fc.onCreate(this, params, init)
  }

  /** 查询该字段对应的字段类型对象, 不存在返回null */
  get conf(){
    return findField(this.type)
  }

  /** 字段是否验证失败 */
  get invalid(){
    return this.validation.valid === EnumValidityState.ERROR
  }

  get root(){
    let parent = this.parent
    while(parent != null){
      if(parent instanceof FormSchema) return parent

      parent = parent.parent
    }
    
    return null
  }

  get model(){
    if(this.state.mounted === false) return undefined

    const fc = this.conf
    return isFunction(fc?.onValueSubmit) ? fc.onValueSubmit(this) : this.value
  }

  private normalizeParams(params: any): any{
    if(isNull(params)) return {}

    return params instanceof FieldConf ? params.toParams() : params
  }

  /**
   * 复制该对象
   * @param keepName - 值为`true`时，保留`name`属性
   * @returns 复制的对象
   */
  clone(keepName = false) {
    const data = JSON.parse(JSON.stringify(this))
    if(!keepName) cleanName(data)
    return new FormField(data)
  }

  /** 验证字段 */
  validate(options?: { mode: EnumValidateMode }){
    return new Promise((resolve, reject) => {
      const action: ValidateAction = {
        type: 'validate',
        field: this,
        mode: options?.mode,
        callback: (status: boolean, r: any) => {
          status ? resolve(r) : reject(r)
        }
      }

      this.dispatch(action)
    })
  }

  /** 重置字段的验证状态 */
  resetValidate(){
    this.validation.valid = EnumValidityState.NONE
    this.validation.validating = false
    this.validation.message = null
  }

  toJSON(){
    const r = super.toJSON.call(this)
    const onSubmit = this.conf?.onSubmit
    return isFunction(onSubmit) ? onSubmit(r) : r
  }

  find(name: string){
    return this.fields.find(f => f.name == name)
  }

  previous(): FormField[] {
    const parent = this.parent
    if(null == parent) return []

    const index = parent.indexOf(this)
    return parent.fields.filter((f, i) => i < index)
  }

  dispatch(action: Action){
    Promise.resolve().then(() => {
      const root = this.root
      if(root == null) return console.warn('you need add this field to schema first')
      root.dispatch(action)
    })
  }

  setValue(value: any, useDefault?: boolean){
    const fc = this.conf
    const v = (
      useDefault === true  
        ? value === undefined ? genDefaultValue(this) : value
        : value
    )
    this.value = isFunction(fc?.onValueInit) ? fc.onValueInit(this, v) : v
  }

  reactive() {
    return (isReactive(this) ? this : reactive(this)) as FormField
  }
}

function createDefaultValue(raw: any){
  return {
    type: raw?.type ?? BuiltInDefaultValueType.MANUAL,
    value: raw?.value
  }
}

function createValidation(field: FormField, props: PrivateProps){
  field.validation = {
    get valid() { return props.valid },
    set valid(newValue){
      const oldValue = props.valid
      props.valid = newValue

      if(newValue == oldValue) return

      const action: ValidChangeAction = { type: 'valid.change', field, oldValue, newValue }
      field.dispatch(action) 
    },
    validating: false,
    message: null,
    external: null
  } as Validation
}

function createValue(field: FormField, props: PrivateProps){
  Reflect.defineProperty(field, 'value', {
    get(){
      return props.value
    },
    set(v){
      props.value = v
      
      if(!field.state.mounted) return

      const action: ValueChangeAction = { type: 'value.change', field }
      field.dispatch(action)
    }
  })
}

function cleanName(o: any){
  delete o.name
  
  if(Array.isArray(o.fields)){
    const fields = o.fields.filter((i: any) => i.allowClone !== false)
    fields.forEach(cleanName)
    o.fields = fields
  }
}
