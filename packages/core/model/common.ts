import type { 
  Component,
  ComponentPublicInstance,
  ConcreteComponent,
  Ref,
  VNode,
  VNodeProps,
} from 'vue'

import { 
  XField, 
  XFieldConf,
} from '.'

import { XFormSchema } from './XSchema'

export interface AnyProps {
  [propName: string]: any;
}

export type VueComponent = Component
export type RawProps = VNodeProps & AnyProps
export type XFormScope = XField | XFormSchema

export interface XFormPreset {
  name: string;
  version?: string;
  slots?: {
    [prop: string]: VueComponent;
    'setting_form': VueComponent;
  };
  fieldConfs: XFieldConf[];
}

export interface ModeGroup {
  title?: string;
  types: string[];
  fieldConfs?: XFieldConf[];
}

export interface ModeConf {
  [propName: string]: Array<ModeGroup | string>;
}

interface ValidationConf {
  immediate: boolean;
}

export interface XFormConfigBase{
  modes: ModeConf;
  validation: ValidationConf;
  genName: (o: any) => string;
  formatter: (field: XField, props: RawProps, instance: ComponentPublicInstance) => any
}

export type XFormConfig = {
  [P in keyof XFormConfigBase]?: XFormConfigBase[P] extends ValidationConf ? Partial<XFormConfigBase[P]> : XFormConfigBase[P];
}

export type RenderOptions = {
  renderPreivew?: (component: ConcreteComponent | string, props: RawProps, children: () => any, content: () => any) => VNode;
  renderItem?: (component: ConcreteComponent | string, props: RawProps, children: () => any) => VNode;
  renderContent?: (component: ConcreteComponent | string, props: RawProps) => VNode;
}

export type RenderField = (field: XField, options?: RenderOptions) => VNode

export interface XFormBuilderContext{
  type: 'builder';
  // 注册字段
  registerField: (field: Ref<XField>, isExternal: boolean) => void;
  // 删除字段
  removeField: (key: string) => void;
  // 更新字段值
  onUpdateValue: (event: any) => void;
  // 渲染字段
  renderField: RenderField,
  novalidate: Ref<boolean>
}

export interface XFormDesignerContext{
  type: 'designer',
  // 渲染字段
  renderField: RenderField
}

export interface XFormViewerContext{
  type: 'viewer';
  // 渲染字段
  renderField: RenderField;
  formatter: Function
}

export type XFormRenderContext = XFormBuilderContext | XFormDesignerContext | XFormViewerContext;

export interface XFormOption {
  // 组件配置
  preset?: XFormPreset;
  // 表单默认设置
  config?: XFormConfig;
}