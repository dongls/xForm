export const XFORM_CONTEXT_PROVIDE_KEY = __IS_DEV__ ? Symbol('xform.builder.context.provide') : Symbol()
export const XFORM_SCHEMA_PROVIDE_KEY = __IS_DEV__ ? Symbol('xform.schema.provide') : Symbol()
export const XFORM_ITEM_EXTERNAL_PROVIDE_KEY = __IS_DEV__ ? Symbol('xform.item.external.provide') : Symbol()

export const CLASS = {
  DRAGGABLE: 'xform-draggable',
  DROPPABLE: 'xform-droppable',
  FIELD: 'xform-designer-field',
  FORM_ITEM: 'xform-item',
  GHOST_NOT_ALLOW: 'xform-is-not-allowed',
  IS_DISABLED: 'xform-is-disabled',
  IS_DRAGGING: 'xform-is-dragging',
  IS_EMPTY_TIP: 'xform-is-empty-tip',
  IS_ERROR: 'xform-is-error',
  IS_HORIZONTAL_SCROLL: 'xform-is-horizontal-scroll',
  IS_SCROLL: 'xform-is-scroll',
  IS_SELECTED: 'xform-is-selected',
  IS_SHOW: 'xform-is-show',
  IS_UNKNOWN: 'xform-is-unknown',
  IS_WARNING: 'xform-is-warning',
  LIST_SILENCE: 'xform-is-silence',
  PREVIEW: 'xform-preview',
  SCOPE: 'xform-is-scope',
}

export const SELECTOR = {
  DRAGGABLE: `.${CLASS.DRAGGABLE}`,
  DROPPABLE: `.${CLASS.DROPPABLE}`,
  FIELD: `.${CLASS.FIELD}`,
  IS_EMPTY_TIP: `.${CLASS.IS_EMPTY_TIP}`,
  IS_HORIZONTAL_SCROLL: `.${CLASS.IS_HORIZONTAL_SCROLL}`,
  IS_SCROLL: `.${CLASS.IS_SCROLL}`,
  IS_SELECTED: `.${CLASS.IS_SELECTED}`,
  PREVIEW: `.${CLASS.PREVIEW}`,
  SCOPE: `.${CLASS.SCOPE}`,
}

export const PROPS = {
  DRAG_MODE: '__PROP_XFORM_DRAGE_MODE__',
  FIELD: '__PROP_XFORM_FIELD__',
  FIELD_TYPE: '__PROP_XFORM_FIELD_TYPE__',
  SCHEMA: '__PROP_XFORM_SCHEMA__',
  SCOPE: '__PROP_XFORM_SCOPE__',
}

export const EVENTS = {
  MESSAGE: 'message',
  REMOVE: 'remove',
  SUBMIT: 'submit',
  UPDATE_FIELD: 'update:field',
  UPDATE_PROP: 'update:prop',
  UPDATE_SCHEMA: 'update:schema',
  UPDATE_VALUE: 'update:value',
  VALUE_CHANGE: 'value:change',
}

export const LabelPosition = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top'
}

export enum EnumDragMode {
  INSERT = 'insert',
  SORT = 'sort'
}

export enum EnumDragDirection{
  UP = 1,
  DOWN = 2,
  LEFT = 4,
  RIGHT = 8
}

export enum EnumValidityState{
  SUCCESS = 'success',
  ERROR = 'error',
  NONE = 'none'
}

export enum EnumValidateMode{
  /**
   * 默认行为 
   * - 如果没有设置验证模式，验证时按默认行为处理
   * - 只验证本字段
   * - 如果存在子字段，只检测子字段的验证状态
   */
  DEFAULT,
  /**
   * 递归验证
   * - 如果没有子字段，只验证自身
   * - 如果存在子字段，先验证子字段再验证自身
   */
  RECURSIVE
}

export enum EnumComponent {
  SETTING = 'setting',
  PREVIEW = 'preview',
  BUILD = 'build',
  VIEW = 'view'
}

export enum EnumDragEventType {
  DRAGOVER = 'dragover',
  DROP = 'drop'
}

export enum EnumDragHook {
  DRAGOVER = 'onDragOver',
  DROP = 'onDrop',
}

export enum EnumRenderType {
  DESIGNER = 'designer',
  BUILDER = 'builder',
  VIEWER = 'viewer'
}

export const BuiltInDefaultValueType = {
  MANUAL: 'manual',
  OPTION_FIRST: 'option_first',
  OPTION_ALL: 'option_all',
  DATE_NOW: 'date_now'
}
