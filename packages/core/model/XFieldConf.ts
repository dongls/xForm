import XField from './XField'

import { markRaw, ComponentOptions, VNode } from 'vue'
import { XFormModel } from './common'
import { DragContext, DragEvent } from './drag'
import { isFunction, isNull } from '@core/util/lang'

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

export type ValidateFn = (field: XField, model: XFormModel) => Promise<any>
export type Validator = Function ;

type ModeComponentFn = (field: XField, mode: string) => ComponentOptions | VNode;
type XFieldConfComponent = ComponentOptions | ModeComponentFn;
type DragHookFn = (event: MouseEvent, dragEvent: DragEvent, context: DragContext) => void | boolean;

/** 
 * 描述字段类型的类，XForm就是根据它决定每一个字段的行为
 */
export default class XFieldConf{
  // 字段类型
  type: string;
  // 字段名称
  title: string;
  // 字段icon
  icon?: string | Function;

  scoped?: boolean;
  custom?: boolean;
  extension?: object;
  validator?: Validator;

  setting?: XFieldConfComponent;
  preview?: XFieldConfComponent;
  build?: XFieldConfComponent;
  view?: XFieldConfComponent;

  // 字段创建时调用
  onCreated?: (field: XField, params: any) => XField;
  // 字段删除后时调用
  onRemoved?: Function;
  // 字段拖到该字段上方时调用
  onDragOver?: DragHookFn;
  // 字段放到该字段上调用, 只对scoped值为true的字段生效
  onDrop?: DragHookFn;

  constructor(options: any = {}){
    this.type = options.type
    this.title = options.title
    this.icon = options.icon

    this.scoped = options.scoped === true
    this.custom = options.custom === true
    this.extension = options.extension || {}
    this.validator = options.validator

    this.setting = isNull(options.setting) ? null : markRaw(options.setting)
    this.preview = isNull(options.preview) ? null : markRaw(options.preview)
    this.build = isNull(options.build) ? null : markRaw(options.build)
    this.view = isNull(options.view) ? null : markRaw(options.view)

    this.onCreated = isFunction(options.onCreated) ? options.onCreated : null
    this.onRemoved = isFunction(options.onRemoved) ? options.onRemoved : null
    this.onDragOver = isFunction(options.onDragOver) ? options.onDragOver : null
    this.onDrop = isFunction(options.onDrop) ? options.onDrop : null
  }

  /** 
   * 检测自身是否具备最可用的条件, 以下属性是必须的属性：
   * - type 
   * @returns {boolean} 
   */
  get available(): boolean{
    return this.type != null
  }

  toParams(){
    return {
      type: this.type,
      title: this.title
    }
  }
}