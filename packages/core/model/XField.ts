import { findFieldConf } from '../store'
import XFieldConf from './XFieldConf'

interface XFieldStorage {
  fieldConf: XFieldConf;
}

interface XFieldDesignerProps {
  dragging: boolean;
  [prop: string]: any;
}

interface XFieldAttributes{
  [prop: string]: any;
  // 是否允许字段被删除
  remove?: boolean;
}

function initOptions(o: any){
  if(['select', 'checkbox', 'radio'].indexOf(o.type) < 0) return []
  
  const options = Array.isArray(o.options) ? o.options : []
  if(options.length == 0) options.push({ value: '选项1' })
  
  return options as any[]
}

/** 描述字段的类型 */
export default class XField{
  type: string;
  name: string;
  title?: string;

  placeholder?: string;
  required?: boolean;
  options?: any[];
  attributes?: XFieldAttributes;

  /** @deprecated */
  defaultValue: any;

  // 缓存
  storage: XFieldStorage;
  // 设计器属性
  designer: XFieldDesignerProps;

  constructor(o: any){
    this.type = o.type
    this.name = o.name || `field_${Math.random().toString(16).slice(-8)}`
    this.title = o.title
    
    this.placeholder = o.placeholder || ''    
    this.required = o.required === true
    this.options = initOptions(o)
    this.attributes = typeof o.attributes == 'function' ? o.attributes() : o.attributes || {}

    Object.defineProperty(this, 'storage', { 
      enumerable: false, 
      writable: true, 
      value: {
        fieldConf: null
      } 
    })

    Object.defineProperty(this, 'designer', { 
      enumerable: false, 
      writable: true, 
      value: {
        dragging: false
      } 
    })
  }

  /** 查询该字段对应的字段类型对象, 不存在返回null */
  findFieldConf(): XFieldConf | null{
    if(null == this.type) return null

    // 先查询缓存
    const storage = this.storage
    if(storage.fieldConf instanceof XFieldConf) return storage.fieldConf

    // 再查询store
    const fc = findFieldConf(this.type)
    if(fc instanceof XFieldConf) {
      storage.fieldConf = fc
      return fc
    }

    return null
  }

  /** 复制该对象, `name`字段除外 */
  copy(): XField{
    const data = JSON.parse(JSON.stringify(this))
    delete data.name

    return new XField(data)
  }
}