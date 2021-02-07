import { ComponentInternalInstance, markRaw, VNode } from 'vue'
import { VueComponent, XFormModel, XFormScope } from './common'
import { InternalDragEvent } from './drag'
import { isFunction, isNull, isPlainObject, toArray } from '@core/util/lang'
import { XField } from '.'
import { DragHookEnum } from './constant'

export interface Rule{
  max?: number;
  [prop: string]: any;
}

export type ValidateFn = (field: XField, model: XFormModel) => Promise<any>
export type Validator = ValidateFn | Function;

type DragHookFn = (e: InternalDragEvent) => void | boolean;

class Hook{
  // 字段创建时调用
  onCreate?: (field: XField, params: any, init: boolean) => void;
  // 字段删除后时调用
  onRemoved?: (field: XField, scope: XFormScope, instance: ComponentInternalInstance) => void;
  // 字段拖到该字段上方时调用
  [DragHookEnum.DRAGOVER]?: DragHookFn;
  // 字段放到该字段上调用, 只对scoped值为true的字段生效
  [DragHookEnum.DROP]?: DragHookFn;

  constructor(options: any = {}){
    this.onCreate = isFunction(options.onCreate) ? options.onCreate : null
    this.onRemoved = isFunction(options.onRemoved) ? options.onRemoved : null
    this[DragHookEnum.DRAGOVER] = isFunction(options[DragHookEnum.DRAGOVER]) ? options[DragHookEnum.DRAGOVER] : null
    this[DragHookEnum.DROP] = isFunction(options[DragHookEnum.DROP]) ? options[DragHookEnum.DROP] : null
  }
}

export class FieldComponent{
  factory?: (field: XField, mode: string) => VueComponent | VNode;
  // [mode][_[field.name]]?
  extension: {
    [prop: string]: VueComponent
  }

  constructor(options: Partial<FieldComponent>){
    this.factory = isFunction(options.factory) ? options.factory : null
    this.extension = isPlainObject(options.extension) ? options.extension : {}
  }
}

/** 
 * 描述字段类型的类，XForm就是根据它决定每一个字段的行为
 */
export class XFieldConf extends Hook{
  // 字段类型
  type: string;
  // 字段名称
  title: string;
  // 字段icon
  icon?: string | Function;
  alias: XFieldConf;

  scoped?: boolean;
  custom?: boolean;
  validator?: Validator;

  setting?: VueComponent | FieldComponent;
  preview?: VueComponent | FieldComponent;
  build?: VueComponent | FieldComponent;
  view?: VueComponent | FieldComponent;

  // 依赖的子组件
  dependencies: XFieldConf[];

  constructor(options: Partial<XFieldConf>){
    super(options)

    this.type = options.type
    this.title = options.title
    this.icon = options.icon
    this.alias = options.alias instanceof XFieldConf ? options.alias : null

    this.scoped = options.scoped === true
    this.custom = options.custom === true
    this.validator = options.validator

    this.setting = isNull(options.setting) ? null : markRaw(options.setting)
    this.preview = isNull(options.preview) ? null : markRaw(options.preview)
    this.build = isNull(options.build) ? null : markRaw(options.build)
    this.view = isNull(options.view) ? null : markRaw(options.view)
    
    this.dependencies = toArray(options.dependencies)
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

  /** 
   * 建议统一使用该方法创建XFieldConf实例, 
   * 
   * 通过该方法创建的实例会使用Proxy代理属性访问
   * 例如用于配置alias，可直接访问目标的属性
   */
  static create(options: Partial<XFieldConf>){
    return new Proxy(new XFieldConf(options), {
      get(target, prop, receiver){
        const r = Reflect.get(target, prop, receiver)

        return (
          r == null && target.alias instanceof XFieldConf
            ? Reflect.get(target.alias, prop, target.alias) 
            : r
        )
      }
    })
  }

  static createFieldComponent(o: unknown){
    return new FieldComponent(o)
  }
}