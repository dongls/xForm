export const XFORM_CONTEXT_PROVIDE_KEY = Symbol.for('@@xform.builder.context.provide@@')
export const XFORM_FORM_SCHEMA_PROVIDE_KEY = Symbol.for('@@xform.schema.provide@@')
export const XFORM_MODEL_PROVIDE_KEY = Symbol.for('@@xform.model.provide@@')

export const CLASS = {
  GHOST_NOT_ALLOW: 'xform-is-not-allowed',
  IS_DRAGGING: 'xform-is-dragging',
  IS_SELECTED: 'xform-is-selected',
  IS_SHOW: 'xform-is-show',
  LIST_SILENCE: 'xform-is-silence',
  SCOPE: 'xform-is-scope',
  DRAGGABLE: 'xform-draggable',
  DROPPABLE: 'xform-droppable',
  PREVIEW: 'xform-preview',
  FIELD: 'xform-designer-field',
  IS_EMPTY_TIP: 'xform-is-empty-tip',
  IS_ERROR: 'xform-is-error',
  IS_VERTICAL_MARK: 'is-vertical-mark',
  IS_SCROLL: 'xform-is-scroll'
}

export const SELECTOR = {
  DRAGGABLE: `.${CLASS.DRAGGABLE}`,
  DROPPABLE: `.${CLASS.DROPPABLE}`,
  FIELD: `.${CLASS.FIELD}`,
  IS_SELECTED: `.${CLASS.IS_SELECTED}`,
  PREVIEW: `.${CLASS.PREVIEW}`,
  SCOPE: `.${CLASS.SCOPE}`,
  IS_EMPTY_TIP: `.${CLASS.IS_EMPTY_TIP}`
}

export const ATTRS = {
  XFIELD_TYPE: 'xfield-type',
  XFIELD_NAME: 'xfield-name'
}

export const PROPS = {
  XFIELD: 'xform_prop:field',
  SCHEMA: 'xform_prop:schema',
  SCOPE: 'xform_prop:scope',
  XFIELD_TYPE: 'xform_prop:xfield_type',
  DRAG_MODE: 'xform_prop:drag_mode'
}

export enum EnumLabelPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left'
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
   * - 如果没有子字段, 只验证本字段
   * - 如果存在子字段, 等待所有子字段验证完后，验证本字段
   *   - 如果自身没有配置`validator`, 当所有子字段都通过验证时，则认为验证通过
   */
  DEFAULT = 1,
  /** 
   * 只验证字段本身
   * - 不触发子字段的验证
   * - 如果自身没有配置`validator`, 当所有子字段都通过验证时，则认为验证通过
   */
  SLEF
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