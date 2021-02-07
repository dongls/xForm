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
  IS_EMPTY_TIP: 'xform-is-empty-tip'
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

export enum DragModeEnum {
  INSERT = 'insert',
  SORT = 'sort'
}

export enum PositionEnum {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left'
}

export enum DirectionEnum{
  UP = -1,
  DOWN = 1,
  LEFT = -1,
  RIGHT = 1
}

export enum ValidStatusEnum{
  SUCCESS = 'success',
  ERROR = 'error',
  NONE = 'none'
}

export enum ComponentEnum {
  SETTING = 'setting',
  PREVIEW = 'preview',
  BUILD = 'build',
  VIEW = 'view'
}

export enum DragEventTypesEnum{
  DRAGOVER = 'dragover',
  DROP = 'drop'
}

export enum DragHookEnum{
  DRAGOVER = 'onDragOver',
  DROP = 'onDrop',
}

export enum BehaviorEnum{
  DESIGNER = 'designer',
  BUILDER = 'builder'
}