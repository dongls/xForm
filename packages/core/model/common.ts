import type { 
  Component,
  ComponentInternalInstance,
  ComponentOptions,
  VNode,
  VNodeProps,
} from 'vue'

import { EnumRenderType } from './constant'
import { Field } from './Field'
import { FormField } from './FormField'
import { FormSchema } from './FormSchema'

export type DeepPartial<T, P = string | number | boolean | Function | Array<any>> = {
  [K in keyof T]?: T[K] extends P ? T[K] : DeepPartial<T[K]> ;
}

export type VueComponent = Component
export type AnyProps = { [propName: string]: any }
export type RawProps = VNodeProps & AnyProps

export interface ModeGroup {
  title?: string;
  types: string[];
  fields?: Field[];
}

export interface ModeConf {
  [propName: string]: Array<ModeGroup | string>;
}

export type Formatter = (field: FormField, props: RawProps) => any

export interface BaseFormConfig{
  modes: ModeConf;
  validation: {
    immediate: boolean;
  };
  genName: (o: any) => string;
  formatter: Formatter;
  logic?: boolean;
  experiments?: {}
}

export type FormConfig = DeepPartial<BaseFormConfig>

export interface FormPreset {
  name: string;
  version?: string;
  install?: (options: any) => void | (() => void)
}

export type RenderOptions = {
  parentProps?: RawProps;
  renderPreivew?: (component: ComponentOptions | string, props: RawProps, children: () => any, content: () => any) => VNode;
  renderItem?: (component: ComponentOptions, props: RawProps, children: () => any) => VNode;
  renderContent?: (component: ComponentOptions, props: RawProps) => VNode;
}

export type UpdateFieldEvent =  { prop: string, value: any, scope?: string }
export type RenderField = (field: FormField, options?: RenderOptions) => VNode
export type UpdateField = (field: FormField, event: UpdateFieldEvent) => void

export interface FormBuilderContext{
  type: EnumRenderType.BUILDER;
  /** 渲染字段 */
  renderField: RenderField;
}

export interface FormDesignerContext{
  type: EnumRenderType.DESIGNER;
  /** 渲染字段 */
  renderField: RenderField;
  /** 更新字段属性 */
  updateField: UpdateField;
  /** 选中字段 */
  chooseField: (field: FormField) => void;
  emit: (event: string, args: any) => void;
}

export interface FormViewerContext{
  type: EnumRenderType.VIEWER;
  /** 渲染字段 */
  renderField: RenderField;
  formatter: Formatter;
}

export type FormRenderContext = FormBuilderContext | FormDesignerContext | FormViewerContext;

export interface FormOption extends AnyProps {
  /** 组件配置 */
  preset?: FormPreset;
  /** 表单默认设置 */
  config?: FormConfig;
}

export interface FormDesignerApi {
  chooseField: (field: FormField) => void;
  updateSchema: (schema?: FormSchema) => void;
  resetSelectedField: () => void
}

export interface FormBuilderApi {
  validate: () => Promise<{valid: boolean, model?: any}>;
  reset: () => void;
  resetValidate: () => void
}

export interface FormViewerApi {
  formatter: Formatter
}

export type Icon = string | VNode | ((conf: Field, field?: FormField) => any)
export type Button = {
  icon: Icon,
  title: string,
  handle: (field: FormField, api: FormDesignerApi, instance: ComponentInternalInstance) => void
}