import { markRaw, ComponentOptions, VNode } from 'vue'
import { XFormItemContext } from './common'
import XField from './XField'

export enum ComponentEnum {
  SETTING = 'setting',
  PREVIEW = 'preview',
  BUILD = 'build',
  VIEW = 'view'
}

export interface Rule{
  max?: number;
  [prop: string]: any;
}

export type ValidateFunc = (field: XField, value: any, model: any, context: XFormItemContext) => Promise<any>
export type Validator = ValidateFunc;

type XFieldConfComponent = ComponentOptions | ((field: XField, mode: string) => ComponentOptions | VNode);

/** 描述字段类型的类，主要用于组件渲染 */
export default class XFieldConf{
  // 字段类型
  type: string;
  // 字段名
  title: string;
  // 字段icon
  icon?: string | Function;

  custom?: boolean;
  attributes?: object;
  extension?: object;
  validator?: Validator;

  setting?: XFieldConfComponent;
  preview?: XFieldConfComponent;
  build?: XFieldConfComponent;
  view?: XFieldConfComponent

  constructor(options: any = {}){
    this.type = options.type
    this.title = options.title
    this.icon = options.icon
    this.custom = options.custom === true

    this.attributes = options.attributes 
    this.extension = options.extension || {}
    this.validator = options.validator

    this.setting = options.setting == null ? null : markRaw(options.setting)
    this.preview = options.preview == null ? null : markRaw(options.preview)
    this.build = options.build == null ? null : markRaw(options.build)
  }

  /** 
   * 检测自身是否具备最可用的条件, 以下个属性是必须的属性：
   * - type 
   * @returns {boolean} 
   */
  get available(): boolean{
    return this.type != null
  }
}