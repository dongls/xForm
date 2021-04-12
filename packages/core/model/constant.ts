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

export const PROPS = Object.freeze({
  DRAG_MODE: 'xform_prop:drag_mode',
  FIELD: 'xform_prop:field',
  FIELD_TYPE: 'xform_prop:field_type',
  SCHEMA: 'xform_prop:schema',
  SCOPE: 'xform_prop:scope',
})

export const EVENTS = Object.freeze({
  MESSAGE: 'message',
  REMOVE: 'remove',
  SUBMIT: 'submit',
  UPDATE_FIELD: 'update:field',
  UPDATE_PROP: 'update:prop',
  UPDATE_SCHEMA: 'update:schema',
  UPDATE_VALUE: 'update:value',
  VALUE_CHANGE: 'value:change',
})

export const LabelPosition = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top'
})

export const LogicOperator = Object.freeze({
  LT: Object.freeze({
    value: 'lt',
    text: '小于',
    code: '<'
  }),
  LTE: Object.freeze({
    value: 'lte',
    text: '小于或等于',
    code: '<='
  }),
  GT: Object.freeze({
    value: 'gt',
    text: '大于',
    code: '>'
  }),
  GTE: Object.freeze({
    value: 'gte',
    text: '大于或等于',
    code: '>='
  }),
  EQ: Object.freeze({
    value: 'eq',
    text: '等于',
    code: '=='
  }),
  NE: Object.freeze({
    value: 'ne',
    text: '不等于',
    code: '!='
  }),
  EMPTY: Object.freeze({
    value: 'empty',
    text: '为空',
    code: 'empty'
  }),
  CONTAINS: Object.freeze({
    value: 'contains',
    text: '包含',
    code: 'contains'
  }),
  AND: Object.freeze({
    value: 'and',
    text: '逻辑与',
    code: '&&',
    description: '所有'
  }),
  OR: Object.freeze({
    value: 'or',
    text: '逻辑或',
    code: '||',
    description: '任一'
  }),
  NOT: Object.freeze({
    value: 'not',
    text: '逻辑非',
    code: '!',
    description: '没有'
  })
})

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