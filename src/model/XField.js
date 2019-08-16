import Store from '../util/store';
import XFieldType from './XFieldType';

function initOptions(params){
  if(['select', 'checkbox', 'radio'].indexOf(params.type) < 0) return [];
  
  let options = Array.isArray(params.options) ? params.options : []
  if(options.length == 0) options.push({value: '选项1'});
  
  return options;
}

/** 描述字段的类型 */
export default class XField{
  constructor(params){
    this.type = params.type;
    this.name = params.name || `field_${Math.random().toString(16).slice(-8)}`
    this.title = params.title;
    
    this.placeholder = params.placeholder;
    this.help = params.help;
    this.defaultValue = params.defaultValue;
    
    this.required = params.required === true;
    this.options = initOptions(params);
    this.attributes = typeof params.attributes == 'function' ? params.attributes() : params.attributes || {};

    // 设计器相关属性
    this.designer = {
      dragging: false,
    }

    Object.defineProperty(this, '_exclude_props', {
      enumerable: false,
      value: ['designer', 'storage']
    });

    Object.defineProperty(this, '_storage', {
      enumerable: false,
      value: {
        // 缓存字段类型对象
        fieldType: null
      }
    });
  }

  /** 覆写JSON序列化方法 */
  toJSON(){
    const exclude = this._exclude_props || [];
    const props = Object.keys(this).filter(k => exclude.indexOf(k) < 0);
    const o = {};

    for(let i = 0; i < props.length; i++){
      const prop = props[i];
      o[prop] = this[prop]
    }

    return o;
  }

  /**
   * 查询该字段对应的字段类型对象
   * @returns {XFieldType | null} 不存在返回null
   */
  findFieldType(){
    if(null == this.type) return null;

    // 先查询缓存
    const storage = this._storage;
    if(storage.fieldType instanceof XFieldType) return storage.fieldType;

    // 再查询store
    const ft = Store.findFieldType(this.type);
    if(null != ft) storage.fieldType = ft;

    return ft;
  }

  /** 
   * 复制该对象, `name`字段不复制
   * @returns {XField}
   */
  copy(){
    const data = JSON.parse(JSON.stringify(this))
    delete data.name;

    return new XField(data);
  }
}