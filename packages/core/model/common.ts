import { ComponentOptionsMixin, Ref } from 'vue'

import XField from './XField'
import XFieldConf from './XFieldConf'

export interface DragContext {
  dragEvent: DragEvent;
}

export interface DragEvent {
  init: boolean;
  // 拖拽模式: sort, insert
  mode: string; 
  field?: XField;
  target: HTMLElement;
  prevClientY: number;
  offsetLeft: number;
  offsetTop: number;
}

export type WrappedValidator = () => Promise<any>;

export interface XFormItemContext {
  validating: Ref;
  message: Ref<string>;
  validator?: WrappedValidator;
}

export interface FieldEventDetail {
  key: string;
}

export interface FieldAddEventDetail extends FieldEventDetail {
  validator?: WrappedValidator;
  field?: XField;
}

export interface XFormModel {
  [propName: string]: any;
}

export interface XFormSchema {
  fields: XField[];
  labelSuffix?: string;
  labelPosition?: string;

  viewerPlaceholder?: string;

  [propName: string]: any;
}

export interface XFormPreset {
  name: string;
  version?: string;
  slots: {
    [prop: string]: ComponentOptionsMixin;
  };
  fieldConfs: XFieldConf[];
}

export interface XFormOption {
  // 组件配置
  preset: XFormPreset;
  // 表单默认设置
  config: XFormConf;
}

export interface ModeGroup {
  title?: string;
  types: string[];
  fieldConfs?: XFieldConf[];
}

export interface ModeConf {
  [propName: string]: Array<ModeGroup | string>;
}

interface ValidatorConf {
  immediate?: boolean;
}

interface DesignerConf {
  init?: () => any;
}

export interface XFormConf{
  modes?: ModeConf;
  validator?: ValidatorConf;
  designer?: DesignerConf;
  confirm?: (message: string) => Promise<boolean>;
}