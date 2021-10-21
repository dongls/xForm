import type { 
  Component,
  ComponentPublicInstance,
  ConcreteComponent,
  VNode,
  VNodeProps,
} from 'vue'

import { FieldConf } from './FieldConf'
import { FormField } from './FormField'
import FormStore from '../api/store'

export type DeepPartial<T, P = string | number | boolean | Function | Array<any>> = {
  [K in keyof T]?: T[K] extends P ? T[K] : DeepPartial<T[K]> ;
}

export type VueComponent = Component
export type AnyProps = { [propName: string]: any }
export type RawProps = VNodeProps & AnyProps

export interface ModeGroup {
  title?: string;
  types: string[];
  fieldConfs?: FieldConf[];
}

export interface ModeConf {
  [propName: string]: Array<ModeGroup | string>;
}

export interface FormConfigBase{
  modes: ModeConf;
  validation: {
    immediate: boolean;
  };
  genName: (o: any) => string;
  formatter: (field: FormField, props: RawProps, instance: ComponentPublicInstance) => any;
  logic?: boolean;
  experiments?: {}
}

export type FormConfig = DeepPartial<FormConfigBase>

export interface FormPreset {
  name: string;
  version?: string;
  slots?: {
    [prop: string]: VueComponent;
    'setting_form'?: VueComponent;
  };
  fieldConfs: FieldConf[];
  config?: FormConfig;
  install?: (store: typeof FormStore) => void
}

export type RenderOptions = {
  parentProps?: RawProps;
  renderPreivew?: (component: ConcreteComponent | string, props: RawProps, children: () => any, content: () => any) => VNode;
  renderItem?: (component: ConcreteComponent | string, props: RawProps, children: () => any) => VNode;
  renderContent?: (component: ConcreteComponent | string, props: RawProps) => VNode;
}

export type RenderField = (field: FormField, options?: RenderOptions) => VNode
export type UpdateField = (field: FormField, event: { prop: string, value: any, scope?: string }) => void

export interface FormBuilderContext{
  type: 'builder';
  /** 更新字段值 */
  onUpdateValue: (event: any) => void;
  /** 渲染字段 */
  renderField: RenderField;
}

export interface FormDesignerContext{
  type: 'designer';
  /** 渲染字段 */
  renderField: RenderField;
  /** 更新字段属性 */
  updateField: UpdateField;
  /** 选中字段 */
  chooseField: (field: FormField) => void;
  emit: (event: string, args: any) => void;
}

export interface FormViewerContext{
  type: 'viewer';
  /** 渲染字段 */
  renderField: RenderField;
  formatter: Function;
}

export type FormRenderContext = FormBuilderContext | FormDesignerContext | FormViewerContext;

export interface FormOption {
  /** 组件配置 */
  preset?: FormPreset;
  /** 表单默认设置 */
  config?: FormConfig;
}

export type LogicRule = {
  /** 操作符 */
  operator: string;
  /** 字段`name` */
  name?: string;
  /** 目标值 */
  value?: any;
  /* TODO: 比较的对象，例如字段的值、长度等 */
  target?: any;
  /** 子条件 */
  condition?: LogicRule[]
}
