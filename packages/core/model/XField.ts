import { isFunction } from '@core/util/lang'
import { findFieldConf } from '../store'
import XFieldConf from './XFieldConf'
import { ValidStatusEnum } from './constant'

interface Validation {
  // 验证信息
  message: string;
  // 验证是否通过
  valid: ValidStatusEnum;
  validating: boolean;
}

interface XFieldStorage {
  [prop: string]: any;
  // 缓存字段父级
  parent: any;
  excludeProps: string[]
}

interface XFieldAttributes{
  [prop: string]: any;
  // 是否允许字段被删除
  remove?: boolean;
}

interface Option {
  value: string;
}

// TODO: move to fieldconf
// function initOptions(o: any){
//   if(['select', 'checkbox', 'radio'].indexOf(o.type) < 0) return []
  
//   const options = Array.isArray(o.options) ? o.options : []
//   if(options.length == 0) options.push({ value: '选项1' })
  
//   return options as any[]
// }

// TODO: 支持用户指定算法
function genName(){
  const time = Date.now().toString(36)
  const random = Math.random().toString(36).slice(-4)

  return `field_${time}${random}`
}

/** 
 * 描述字段数据的类，XForm就是用它与后端进行数据交换。
 * 
 * 1. 保存用户对字段的配置数据
 * 2. 保存用户在表单中操作数据
 */
export default class XField{
  type: string;
  name: string;

  title?: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[];
  attributes?: XFieldAttributes;
  fields: XField[];

  defaultValue: any;

  // 验证相关属性
  validation: Validation = {
    valid: ValidStatusEnum.NONE,
    message: null,
    validating: false
  }  

  // 缓存
  storage: XFieldStorage;

  constructor(o: any = {}, parent?: any){
    const params = o instanceof XFieldConf ? o.toParams() : o

    this.type = params.type
    this.name = params.name ?? genName()
    this.title = params.title
    
    this.placeholder = params.placeholder ?? ''    
    this.required = params.required === true
    this.options = Array.isArray(params.options) ? params.options : []
    this.attributes = params.attributes || {}
    this.fields = (
      Array.isArray(params.fields) 
        ? params.fields.map((f: any) => f instanceof XField ? f : new XField(f, this)) 
        : []
    )

    Object.defineProperty(this, 'storage', { 
      writable: true, 
      value: {
        parent,
        excludeProps: ['validation']
      } 
    })

    const fc = this.conf
    if(fc && isFunction(fc.onCreated)) fc.onCreated(this, params)
  }

  /** 查询该字段对应的字段类型对象, 不存在返回null */
  get conf(){
    return findFieldConf(this.type)
  }

  get parent(){
    return this.storage.parent
  }

  set parent(v){
    this.storage.parent = v
  }

  /** 复制该对象, `name`字段除外 */
  clone() {
    const parent = this.parent
    const data = JSON.parse(JSON.stringify(this))
    delete data.name
    return new XField(data, parent)
  }

  toJSON(): any {
    const origin = this as any
    const ep = this.storage.excludeProps
    return Object.keys(origin)
      .filter(i => ep.indexOf(i) < 0)
      .reduce((acc, k) => ((acc[k] = origin[k]), acc), {} as any)
  }
}