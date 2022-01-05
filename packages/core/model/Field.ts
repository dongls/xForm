import { ComponentInternalInstance, markRaw, VNode } from 'vue'
import { Icon, Button, VueComponent } from './common'
import { PublicDragEvent } from './drag'
import { isFunction, isNull, isPlainObject, isString, toArray, toFunction } from '../util/lang'
import { FormField, FormFieldLogic } from './FormField'
import { EnumDragHook, EnumValidateMode } from './constant'
import { FormScope } from './FormScope'
import { findField } from '../api/Field'
import { BUTTON_COPY, BUTTON_REMOVE } from './Button'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Rule{}

// TODO: 重构，返回值只有在需要异步时才返回Promise, 如不需要则直接返回验证结果
type ValidateResult = void | null | string
export type ValidateFunc = (field: FormField, value: any, options?: { mode: EnumValidateMode }) => Promise<ValidateResult>;
export type ValidateObj = { mode: EnumValidateMode, validator: ValidateFunc }
type Validator = ValidateFunc | ValidateObj | Rule | Rule[] | false
type DragHookFn = (e: PublicDragEvent) => void | boolean;

export interface FieldLogic {
  /** 类型，建议值唯一 */
  type: string
  /** 标题 */
  title: string
  /** 用于判断当前字段是否满足条件 */
  test: (logic: FormFieldLogic, field: FormField) => boolean
  /** 当前逻辑的渲染器，用在表单设计中 */
  render: (logic: FormFieldLogic, field: FormField) => any
  /** 验证当前逻辑是否填写所有必要条件 */
  validator?: (logic: FormFieldLogic, rootField: FormField) => string | null | undefined | void | boolean
  /** 组合式逻辑，自身依赖于其他逻辑运行 */
  composed?: boolean
  /** 顺序 */
  order?: number
  /** 创建字段逻辑对象后调用，可以在此自行添加属性 */
  onCreated?: (logic: FormFieldLogic, rootField: FormField) => void
}

const CONSTRUCTOR_SIGN = Symbol()

class Hook{
  /** 字段值初始化时触发 */
  onValueInit?: (field: FormField, value: any) => any
  /** 字段值提交时触发 */
  onValueSubmit?: (field: FormField) => any
  /** 验证字段自身时调用 */
  onValidate?: (field: FormField) => Promise<string | void>
  /** 字段创建时调用 */
  onCreate?: (field: FormField, params: any, init: boolean) => void
  /** 字段删除后时调用 */
  onRemoved?: (field: FormField, scope: FormScope, instance: ComponentInternalInstance) => void
  /** 字段提交时触发，一般在转换为JSON时调用 */
  onSubmit?: (data: any) => object;
  /** 字段拖到该字段上方时调用 */
  [EnumDragHook.DRAGOVER]?: DragHookFn;
  /** 字段放到该字段上调用 */
  [EnumDragHook.DROP]?: DragHookFn

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
  factory?: (field: FormField, mode: string) => VueComponent | VNode
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

/** 描述字段类型的类，xForm就是根据它决定每一个字段的行为 */
export class Field extends Hook{
  /** 字段类型, 建议保证值唯一。`xForm`根据该属性存储和查找字段 */
  type: string
  /** 字段名称 */
  title: string
  /** 字段icon */
  icon?: Icon
  /** 字段按钮，用在设计器中 */
  buttons?: Button[]
  alias?: string | Field

  /** 可接受的子字段类型，为空则接受所有字段 */
  accept?: string[]
  /** 标识当前字段是否完全自定义渲染 */
  custom: boolean
  /** 验证器，用于验证表单值 */
  validator?: Validator

  setting?: VueComponent | FieldComponent
  preview?: VueComponent | FieldComponent
  build?: VueComponent | FieldComponent
  view?: VueComponent | FieldComponent

  /** 依赖的子组件 */
  dependencies: Field[]
  /** 该字段支持的逻辑 */
  logic: FieldLogic[]

  constructor(options: Partial<Field> = {}, from?: Symbol){
    if(from != CONSTRUCTOR_SIGN) console.warn('use `Field.create` instead of `new Field`')

    super(options)

    this.type = options.type
    this.title = options.title
    this.icon = options.icon
    this.buttons = toArray(options.buttons, null)

    this.alias = (
      options.alias instanceof Field 
        ? options.alias 
        : isString(options.alias) ? options.alias : null
    )

    this.accept = Array.isArray(options.accept) ? options.accept : null
    this.custom = options.custom === true
    this.validator = options.validator

    this.setting = isNull(options.setting) ? null : markRaw(options.setting)
    this.preview = isNull(options.preview) ? null : markRaw(options.preview)
    this.build = isNull(options.build) ? null : markRaw(options.build)
    this.view = isNull(options.view) ? null : markRaw(options.view)
    
    this.dependencies = toArray(options.dependencies)
    this.logic = toArray(options.logic)
  }

  /** 
   * 检测自身是否具备最可用的条件, 以下属性是必须的属性：
   * - type 
   */
  get available() {
    return this.type != null
  }

  /** 
   * 建议统一使用该方法创建`Field`实例, 
   * 
   * 通过该方法创建的实例会使用Proxy代理属性访问
   * 例如用于配置alias，可直接访问目标的属性
   */
  static create(options: Partial<Field>){
    return new Proxy(new Field(options, CONSTRUCTOR_SIGN), {
      get(target, prop, receiver){
        const r = Reflect.get(target, prop, receiver)
        if(r != null) return r

        const alias = (
          target.alias instanceof Field 
            ? target.alias
            : isString(target.alias) ? findField(target.alias) : null
        )

        return alias == null ? r : Reflect.get(alias, prop, target.alias) 
      }
    })
  }

  static createFieldComponent(o: unknown){
    return new FieldComponent(o)
  }

  static createFieldLogic(options: FieldLogic){
    return Object.freeze<FieldLogic>(options)
  }

  static BUTTON_COPY = BUTTON_COPY
  static BUTTON_REMOVE = BUTTON_REMOVE

  /** 生成用于创建`FormField`的参数 */
  toParams(){
    return {
      type: this.type,
      title: this.title
    }
  }
}