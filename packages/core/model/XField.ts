
import { isFunction } from '@core/util/lang'
import { findFieldConf, getConfig } from '../store'
import { ValidStatusEnum } from './constant'
import { markRaw } from 'vue'
import { AnyProps, XFormScope } from './common'
import { XFieldConf } from '.'

interface Validation {
  // 验证信息
  message: string;
  // 验证是否通过
  valid: ValidStatusEnum;
  validating: boolean;
}

interface Option {
  value: string;
}

/** 
 * 描述字段数据的类，XForm就是用它与后端进行数据交换。
 * 
 * 1. 保存用户对字段的配置数据
 * 2. 保存用户在表单中操作数据
 */
export class XField implements XFormScope{
  type: string;
  name: string;  
  title?: string;

  placeholder?: string;
  required?: boolean;
  options?: Option[];

  attributes?: { [prop: string]: any };
  fields: XField[];

  // 是否允许字段被删除
  allowRemove?: boolean;
  // 是否允许复制字段
  allowClone?: boolean;

  // 验证相关属性
  validation: Validation = {
    valid: ValidStatusEnum.NONE,
    validating: false,
    message: null
  }

  // 缓存
  private storage: {
    rawData: any;
    excludeProps: string[];
  } & AnyProps;

  constructor(o: any = {}){
    const params = o instanceof XFieldConf ? o.toParams() : o

    this.type = params.type
    this.name = params.name ?? getConfig().genName(o)
    this.title = params.title
    
    this.placeholder = params.placeholder 
    this.required = params.required === true
    this.options = Array.isArray(params.options) ? params.options : undefined
    this.attributes = params.attributes ?? {}
    this.fields = (
      Array.isArray(params.fields) 
        ? params.fields.map(XField.create) 
        : []
    )

    this.allowRemove = params.allowRemove
    this.allowClone = params.allowClone

    Object.defineProperty(this, 'storage', {
      // 在调用reactive()后，该对象被vue3.x使用Proxy代理访问
      // 如果不使用markRaw()标识该字段，在访问storage时，vue3.x会使用reactive()包裹该属性，
      // 由于该属性是只读且不可配置的，所以会抛出错误
      // Uncaught TypeError: 'get' on proxy: property 'storage' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value
      value: markRaw({
        rawData: params,
        excludeProps: ['validation']
      })
    })

    const fc = this.conf
    if(fc && isFunction(fc.onCreate)) fc.onCreate(this, params)
  }

  /** 查询该字段对应的字段类型对象, 不存在返回null */
  get conf(){
    return findFieldConf(this.type)
  }

  get rawData(){
    return this.storage.rawData
  }

  /** 清除字段的验证信息 */
  resetValidate(){
    this.validation.valid = ValidStatusEnum.NONE
    this.validation.validating = false
    this.validation.message = null
  }

  /** 复制该对象, `name`字段除外 */
  clone() {
    const data = JSON.parse(JSON.stringify(this))
    delete data.name
    return new XField(data)
  }

  toJSON(): any {
    const origin = this as any
    const ep = this.storage.excludeProps
    return Object.keys(origin)
      .filter(i => ep.indexOf(i) < 0)
      .reduce((acc, k) => ((acc[k] = origin[k]), acc), {} as any)
  }
  
  static create(f: unknown){
    return f instanceof XField ? f : new XField(f)
  }
}