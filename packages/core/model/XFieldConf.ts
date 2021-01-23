import { markRaw, VNode } from 'vue'
import { VueComponent, XFormModel } from './common'
import { GlobalDragEvent } from './drag'
import { isFunction, isNull } from '@core/util/lang'
import { XField } from '.'

export interface Rule{
  max?: number;
  [prop: string]: any;
}

export type ValidateFn = (field: XField, model: XFormModel) => Promise<any>
export type Validator = Function ;

type XFieldConfComponent = (
  VueComponent | 
  ((field: XField, mode: string) => VueComponent | VNode)
)
type DragHookFn = (dragEvent: GlobalDragEvent) => void | boolean;

class Hook{
  // 字段创建时调用
  onCreate?: (field: XField, params: any) => XField;
  // 字段删除后时调用
  onRemoved?: Function;
  // 字段拖到该字段上方时调用
  onDragOver?: DragHookFn;
  // 字段放到该字段上调用, 只对scoped值为true的字段生效
  onDrop?: DragHookFn;

  constructor(options: any = {}){
    this.onCreate = isFunction(options.onCreate) ? options.onCreate : null
    this.onRemoved = isFunction(options.onRemoved) ? options.onRemoved : null
    this.onDragOver = isFunction(options.onDragOver) ? options.onDragOver : null
    this.onDrop = isFunction(options.onDrop) ? options.onDrop : null
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
  extension?: object;
  validator?: Validator;

  setting?: XFieldConfComponent;
  preview?: XFieldConfComponent;
  build?: XFieldConfComponent;
  view?: XFieldConfComponent;

  constructor(options: Partial<XFieldConf>){
    super(options)

    this.type = options.type
    this.title = options.title
    this.icon = options.icon
    this.alias = options.alias instanceof XFieldConf ? options.alias : null

    this.scoped = options.scoped === true
    this.custom = options.custom === true
    this.extension = options.extension || {}
    this.validator = options.validator

    this.setting = isNull(options.setting) ? null : markRaw(options.setting)
    this.preview = isNull(options.preview) ? null : markRaw(options.preview)
    this.build = isNull(options.build) ? null : markRaw(options.build)
    this.view = isNull(options.view) ? null : markRaw(options.view)
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
}