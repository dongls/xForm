import { ComponentOptionsMixin, VNodeProps, WatchStopHandle } from 'vue'

import XField from './XField'
import XFieldConf from './XFieldConf'

export interface AnyProps extends Object {
  [propName: string]: any;
}

export type XFormModel = AnyProps

export type RawProps = VNodeProps & AnyProps

export interface XFormSchema extends AnyProps {
  fields: XField[];
  labelSuffix?: string;
  labelPosition?: string;

  viewerPlaceholder?: string;
}

export interface XFormPreset {
  name: string;
  version?: string;
  slots: {
    [prop: string]: ComponentOptionsMixin;
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
  immediate?: boolean;
}

export interface XFormConf{
  modes?: ModeConf;
  validation?: ValidationConf;
  confirm?: (message: string) => Promise<boolean>;
}

export type WrappedValidator = () => Promise<any>

export interface ValidateOptions {
  validator: WrappedValidator;
  stopHandle: WatchStopHandle;
}

export interface XFormBuilderContext {
  // 注册字段
  registerField: (key: string, o: WrappedValidator) => void;
  // 删除字段
  removeField: (key: string) => void;
  // 更新字段值
  updateFieldValue: Function;
}

export interface XFormOption {
  // 组件配置
  preset?: XFormPreset;
  // 表单默认设置
  config: XFormConf;
}