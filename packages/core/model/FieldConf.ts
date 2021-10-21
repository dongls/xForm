import { ComponentInternalInstance, markRaw, VNode } from 'vue'
import { VueComponent } from './common'
import { PublicDragEvent } from './drag'
import { isFunction, isNull, isPlainObject, toArray, toFunction } from '../util/lang'
import { FormField } from './FormField'
import { EnumDragHook, EnumValidateMode } from './constant'
import { FormScope } from './FormScope'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Rule{}

export type ValidateFunc = (field: FormField, value: any, options?: { mode: EnumValidateMode }) => Promise<string | void>;
export type ValidateObj = { mode: EnumValidateMode, validator: ValidateFunc }
type Validator = ValidateFunc | ValidateObj | Rule | Rule[] | false
type DragHookFn = (e: PublicDragEvent) => void | boolean;

const CONSTRUCTOR_SIGN = Symbol()

class Hook{
  /** 字段值初始化时触发 */
  onValueInit?: (field: FormField, value: any) => any;
  /** 字段值提交时触发 */
  onValueSubmit?: (field: FormField) => any;
  /** 验证字段自身时调用 */
  onValidate?: (field: FormField) => Promise<string | void>;
  /** 字段创建时调用 */
  onCreate?: (field: FormField, params: any, init: boolean) => void;
  /** 字段删除后时调用 */
  onRemoved?: (field: FormField, scope: FormScope, instance: ComponentInternalInstance) => void;
  /** 字段提交时触发，一般在转换为JSON时调用 */
  onSubmit?: (data: any) => object;
  /** 字段拖到该字段上方时调用 */
  [EnumDragHook.DRAGOVER]?: DragHookFn;
  /** 字段放到该字段上调用 */
  [EnumDragHook.DROP]?: DragHookFn;

  constructor(options: Partial<Hook> = {}){
    this.onValueInit = toFunction(options.onValueInit)
    this.onValueSubmit = toFunction(options.onValueSubmit)
    this.onValidate = toFunction(options.onValidate)
    this.onCreate = toFunction(options.onCreate)
    this.onRemoved = toFunction(options.onRemoved)
    this.onSubmit = toFunction(options.onSubmit)
    this[EnumDragHook.DRAGOVER] = toFunction(options[EnumDragHook.DRAGOVER])
    this[EnumDragHook.DROP] = toFunction(options[EnumDragHook.DROP])
  }
}

export class FieldComponent{
  factory?: (field: FormField, mode: string) => VueComponent | VNode;
  extension: {
    // prop: [mode][_[field.name]]?
    [prop: string]: VueComponent
  }

  constructor(options: Partial<FieldComponent>){
    this.factory = isFunction(options.factory) ? options.factory : null
    this.extension = isPlainObject(options.extension) ? options.extension : {}
  }

  get(field: FormField, mode?: string){
    if(isFunction(this.factory)) return this.factory(field, mode)

    return this.extension[`${mode}_${field.name}`] || this.extension[mode]
  }
}

/** 描述字段类型的类，XForm就是根据它决定每一个字段的行为 */
export class FieldConf extends Hook{
  /** 字段类型 */
  type: string;
  /** 字段名称 */
  title: string;
  /** 字段icon */
  icon?: string | Function;
  alias: FieldConf;

  /** 可接受的子字段类型，为空则接受所有字段 */
  accept?: string[];
  scoped?: boolean;
  custom?: boolean;
  /** 验证器，用于验证表单值 */
  validator?: Validator;

  setting?: VueComponent | FieldComponent;
  preview?: VueComponent | FieldComponent;
  build?: VueComponent | FieldComponent;
  view?: VueComponent | FieldComponent;

  /** 依赖的子组件 */
  dependencies: FieldConf[];
  operators: false | string[];

  constructor(options: any = {}, from?: Symbol){
    if(from != CONSTRUCTOR_SIGN) console.warn('use `FieldConf.create` instead of `new FieldConf`')

    super(options)

    this.type = options.type
    this.title = options.title
    this.icon = options.icon
    this.alias = options.alias instanceof FieldConf ? options.alias : null

    this.accept = Array.isArray(options.accept) ? options.accept : null
    this.scoped = options.scoped === true
    this.custom = options.custom === true
    this.validator = options.validator

    this.setting = isNull(options.setting) ? null : markRaw(options.setting)
    this.preview = isNull(options.preview) ? null : markRaw(options.preview)
    this.build = isNull(options.build) ? null : markRaw(options.build)
    this.view = isNull(options.view) ? null : markRaw(options.view)
    
    this.dependencies = toArray(options.dependencies)
    this.operators = options.operators
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
   * 建议统一使用该方法创建`FieldConf`实例, 
   * 
   * 通过该方法创建的实例会使用Proxy代理属性访问
   * 例如用于配置alias，可直接访问目标的属性
   */
  static create(options: Partial<FieldConf>){
    return new Proxy(new FieldConf(options, CONSTRUCTOR_SIGN), {
      get(target, prop, receiver){
        const r = Reflect.get(target, prop, receiver)

        return (
          r == null && target.alias instanceof FieldConf
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