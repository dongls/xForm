import { getIncNum, isFunction, mixinRestParams, usePrivateProps } from '../util/lang'
import { findFieldConf, getConfig, isImmediateValidate } from '../store'

import { EnumValidateMode, EnumValidityState } from './constant'
import { ValidateFunc, XFieldConf } from './XFieldConf'
import { Serializable } from './base'

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

interface Option { value: string }

interface XFieldStorage{
  uid: string;
  broadcast: Function
}

// eslint-disable-next-line no-use-before-define
const PRIV_PROPS = usePrivateProps<XField, XFieldStorage>()

function cleanName(o: any){
  delete o.name
  
  if(Array.isArray(o.fields)){
    const fields = o.fields.filter((i: any) => i.allowClone !== false)
    fields.forEach(cleanName)
    o.fields = fields
  }
}

/** 
 * 描述字段数据的类，XForm就是用它与后端进行数据交换。
 * 
 * 1. 保存用户对字段的配置数据
 * 2. 保存用户在表单中操作数据
 */
export class XField extends Serializable{
  [prop: string]: any

  type: string;
  name: string;  
  title?: string;

  placeholder?: string;
  required?: boolean;
  options?: Option[];

  // 各字段类型的私有属性都存储在此
  attributes?: { [prop: string]: any };
  // 是否允许字段被删除
  allowRemove?: boolean;
  // 是否允许复制字段
  allowClone?: boolean;

  // 子类型
  fields: XField[]
  // 验证相关属性
  validation: Validation = {
    valid: EnumValidityState.NONE,
    validating: false,
    message: null,
    external: null
  }

  value: any;

  // 组件是否挂载
  mounted = false
  
  static EVENT_VALUE_CHANGE = 'xfield.value.change'
  static EVENT_VALIDATE = 'xfield.validate'
  static [Serializable.EXCLUDE_PROPS_KEY] = ['validation', 'mounted', 'value']

  static create(f: Partial<XField>, value?: any){
    return f instanceof XField ? f : new XField(f, value)
  }

  constructor(o: unknown = {}, value?: any){
    super()

    const params = (o instanceof XFieldConf ? o.toParams() : o) as Partial<XField>
    const fc = findFieldConf(params.type)

    this.type = params.type
    this.name = params.name ?? getConfig().genName(o)
    this.title = params.title
    
    this.placeholder = params.placeholder 
    this.required = params.required === true
    this.options = Array.isArray(params.options) ? params.options : undefined
    this.attributes = params.attributes ?? {}
    this.fields = (
      Array.isArray(params.fields) 
        ? params.fields.map(f => XField.create(f)) 
        : []
    )

    this.allowRemove = params.allowRemove
    this.allowClone = params.allowClone
    
    createValue(this, value)

    PRIV_PROPS.create(this, {
      uid: 'field__' + getIncNum(),
      broadcast: null
    })

    mixinRestParams(this, params)
    // 调用onCreate hook, 可在此初始化字段
    isFunction(fc?.onCreate) && fc.onCreate(this, params, o instanceof XFieldConf)
  }

  /** 创建时自动生成，全局唯一 */
  get uid(){
    return PRIV_PROPS.get<string>(this, 'uid')
  }

  /** 查询该字段对应的字段类型对象, 不存在返回null */
  get conf(){
    return findFieldConf(this.type)
  }

  get invalid(){
    return this.validation.valid === EnumValidityState.ERROR
  }

  /**
   * 复制该对象
   * @param keepName - 值为`true`时，保留`name`属性
   * @param value - 字段的值
   * @returns 复制的对象
   */
  clone(keepName = false, value?: any) {
    const data = JSON.parse(JSON.stringify(this))
    if(!keepName) cleanName(data)
    return new XField(data, value)
  }
  
  /** 广播事件 */
  broadcast(event: string, detail?: any){
    const broadcast = PRIV_PROPS.get(this, 'broadcast')
    isFunction(broadcast) && broadcast(event, detail)
  }

  /** 订阅来自字段的事件 */
  subscribe(v: Function){
    PRIV_PROPS.set(this, 'broadcast', v)
  }

  validate(options?: { mode: EnumValidateMode }){
    return new Promise((resolve, reject) => {
      this.broadcast(XField.EVENT_VALIDATE, { 
        field: this,
        mode: options?.mode,
        callback: (status: boolean, r: any) => {
          status ? resolve(r) : reject(r)
        }
      })
    })
  }

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
}

function createValue(field: XField, _value: any){
  let value = isFunction(field.conf?.onValueInit) ? field.conf.onValueInit(field, _value) : _value

  Reflect.defineProperty(field, 'value', {
    get(){
      return value
    },
    set(v){
      value = v

      field.broadcast(XField.EVENT_VALUE_CHANGE, { field: this })
      isImmediateValidate() && field.broadcast(XField.EVENT_VALIDATE, { field: this })
    }
  })
}