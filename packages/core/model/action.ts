import { EnumValidateMode, FormField } from '../model'
import { EnumValidityState } from './constant'

export type FieldInsertAction = {
  type: 'field.insert';
  field: FormField;
  index: number;
}

export type FieldRemoveAction = {
  type: 'field.remove';
  field: FormField;
  index: number;
  oldParent: FormField;
}

export type FieldMoveAction = {
  type: 'field.move';
  field: FormField;
  oldIndex: number;
  newIndex: number;
}

export type ValidateAction = {
  type: 'validate';
  field: FormField;
  mode: EnumValidateMode;
  callback: (status: boolean, r: any) => void;
}

export type ValueChangeAction = {
  type: 'value.change';
  field: FormField;
}

export type ValidChangeAction = {
  type: 'valid.change',
  field: FormField,
  oldValue: EnumValidityState
  newValue: EnumValidityState
}

export type Action =
  FieldInsertAction |
  FieldRemoveAction |
  FieldMoveAction |
  ValidateAction |
  ValueChangeAction |
  ValidChangeAction