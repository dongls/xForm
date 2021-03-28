export const XFORM_CONTEXT_PROVIDE_KEY = Symbol(__IS_DEV__ ? 'xform.builder.context.provide' : '')
export const XFORM_SCHEMA_PROVIDE_KEY = Symbol(__IS_DEV__ ? 'xform.schema.provide' : '')
export const XFORM_ITEM_EXTERNAL_PROVIDE_KEY = Symbol(__IS_DEV__ ? 'xform.item.external.provide' : '')

export const CLASS = Object.freeze({
  DRAGGABLE: 'xform-draggable',
  DROPPABLE: 'xform-droppable',
  FIELD: 'xform-designer-field',
  GHOST_NOT_ALLOW: 'xform-is-not-allowed',
  IS_DRAGGING: 'xform-is-dragging',
  IS_EMPTY_TIP: 'xform-is-empty-tip',
  IS_ERROR: 'xform-is-error',
  IS_SCROLL: 'xform-is-scroll',
  IS_SELECTED: 'xform-is-selected',
  IS_SHOW: 'xform-is-show',
  IS_VERTICAL_MARK: 'is-vertical-mark',
  LIST_SILENCE: 'xform-is-silence',
  PREVIEW: 'xform-preview',
  SCOPE: 'xform-is-scope',
})

export const SELECTOR = Object.freeze({
  DRAGGABLE: `.${CLASS.DRAGGABLE}`,
  DROPPABLE: `.${CLASS.DROPPABLE}`,
  FIELD: `.${CLASS.FIELD}`,
  IS_EMPTY_TIP: `.${CLASS.IS_EMPTY_TIP}`,
  IS_SELECTED: `.${CLASS.IS_SELECTED}`,
  PREVIEW: `.${CLASS.PREVIEW}`,
  SCOPE: `.${CLASS.SCOPE}`,
})

export const ATTRS = Object.freeze({
  XFIELD_TYPE: 'xfield-type',
  XFIELD_NAME: 'xfield-name'
})

export const PROPS = Object.freeze({
  XFIELD: 'xform_prop:field',
  SCHEMA: 'xform_prop:schema',
  SCOPE: 'xform_prop:scope',
  XFIELD_TYPE: 'xform_prop:xfield_type',
  DRAG_MODE: 'xform_prop:drag_mode'
})

export const EVENTS = Object.freeze({
  UPDATE_VALUE: 'update:value',
  UPDATE_FIELD: 'update:field',
  UPDATE_PROP: 'update:prop'
})

export enum EnumLabelPosition {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
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

export enum EnumDragEventType{
  DRAGOVER = 'dragover',
  DROP = 'drop'
}

export enum EnumDragHook{
  DRAGOVER = 'onDragOver',
  DROP = 'onDrop',
}

export enum EnumBehavior{
  DESIGNER = 'designer',
  BUILDER = 'builder'
}