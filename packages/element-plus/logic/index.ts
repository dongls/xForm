import { registerLogic, removeLogic } from '@dongls/xform'

import {
  STRING_VALUE_COMPARE,
  STRING_LENGTH_COMPARE
} from './string'

import {
  NUMBER_VALUE_COMPARE
} from './number'

import {
  DATE_VALUE_COMPARE
} from './date'

import {
  OPTION_VALUE_COMPARE,
  MULTIPLE_OPTION_VALUE_COMPARE
} from './option'

function use(){
  registerLogic(STRING_VALUE_COMPARE)
  registerLogic(STRING_LENGTH_COMPARE)
  registerLogic(NUMBER_VALUE_COMPARE)
  registerLogic(DATE_VALUE_COMPARE)
  registerLogic(OPTION_VALUE_COMPARE)
  registerLogic(MULTIPLE_OPTION_VALUE_COMPARE)
}

function remove(){
  removeLogic(STRING_VALUE_COMPARE)
  removeLogic(STRING_LENGTH_COMPARE)
  removeLogic(NUMBER_VALUE_COMPARE)
  removeLogic(DATE_VALUE_COMPARE)
  removeLogic(OPTION_VALUE_COMPARE)
  removeLogic(MULTIPLE_OPTION_VALUE_COMPARE)
}

export * from './string'
export * from './number'
export * from './date'
export * from './option'

export default {
  use,
  remove
}