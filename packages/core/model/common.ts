import type { 
  ComponentOptions,
  ComponentPublicInstance,
  Ref,
  VNode,
  VNodeProps,
  WatchStopHandle,
} from 'vue'

import { 
  XField, 
  XFieldConf 
} from '.'

export interface AnyProps {
  [propName: string]: any;
}

export type RawProps = VNodeProps & AnyProps
export type VueComponent = ComponentOptions<any>

export type XFormModel = AnyProps

export type XFormScope = {
  fields: XField[];
}

export interface XFormSchema extends XFormScope, AnyProps {
  labelSuffix?: string;
  labelPosition?: string;

  viewerPlaceholder?: string;
}

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
  enable: boolean;
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

export type WrappedValidator = () => Promise<any>

export interface ValidateOptions {
  fieldRef: Ref<XField>;
  validator: WrappedValidator;
  stopHandle: WatchStopHandle;
}

export interface XFormBuilderContext{
  type: 'builder';
  // 注册字段
  registerField: (field: Ref<XField>, o: WrappedValidator) => void;
  // 删除字段
  removeField: (key: string) => void;
  // 更新字段值
  updateFieldValue: (event: any) => void;
  // 渲染字段
  renderField: (field: XField) => VNode;
}

export interface XFormDesignerContext{
  type: 'designer',
  // 渲染字段
  renderField: (field: XField) => VNode;
}

export interface XFormViewerContext{
  type: 'viewer',
  // 渲染字段
  renderField: (field: XField) => VNode;
}

export type XFormContext = XFormBuilderContext | XFormDesignerContext | XFormViewerContext;

export interface XFormOption {
  // 组件配置
  preset?: XFormPreset;
  // 表单默认设置
  config?: XFormConfig;
}