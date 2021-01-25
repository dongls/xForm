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
  PREVIEW: 'xform-preview'
}

export const SELECTOR = {
  DRAGGABLE: `.${CLASS.DRAGGABLE}`,
  DROPPABLE: `.${CLASS.DROPPABLE}`,
  GHOST_TEMPLATE: '.xform-designer-ghost-template',
  IS_SELECTED: `.${CLASS.IS_SELECTED}`,
  SCOPE: `.${CLASS.SCOPE}`,
  TEMPLATE: '.xform-template',
  FIELD: '.xform-designer-field',
  PREVIEW: `.${CLASS.PREVIEW}`
}

export const MATCH_PATHS = ['.xform-designer-mark', SELECTOR.DROPPABLE, '.xform-designer-list']

export const ATTRS = {
  XFIELD_TYPE: 'xfield-type',
  XFIELD_NAME: 'xfield-name'
}

export const PROPS = {
  XFIELD: '__xform_dom_field__',
  SCHEMA: '__xform_dom_schema__',
  SCOPE: '__xform_dom_scope__'
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
  UP = 'up',
  DOWN = 'down'
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