/** 描述字段类型的类，主要用于组件渲染 */
export default class XFieldType{
  constructor(options = {}){
    this.type = options.type;
    this.title = options.title;
    this.icon = options.icon;
    this.custom = options.custom === true;

    this.attributes = options.attributes; 
    this.component = options.component || {};
    this.extension = options.extension || {};
    this.validator = options.validator;
  }

  /** 
   * 检测自身是否具备最可用的条件, 以下几个属性是必须的属性：
   *  - type 
   *  
   * @returns {boolean} 
   */
  get available(){
    return this.type != null;
  }
}

