import { Operators } from '../operator'
 
test('operator: option_eq', () => {
  const o = Operators.OPERATOR_OPTION_EQ

  expect(o.test([1, 2, 3], [3, 2, 1])).toBe(true)
  expect(o.test([1, 2, 3], [])).toBe(false)
  expect(o.test([1, 2, 3], null)).toBe(false)
  expect(o.test([1, 2, 3], [3, 1])).toBe(false)
  expect(o.test(['1', '2', '3'], [3, 2, 1])).toBe(false)
})

test('operator: option_ne', () => {
  const o = Operators.OPERATOR_OPTION_NE

  expect(o.test([1, 2, 3], [3, 2, 1])).toBe(false)
  expect(o.test([1, 2, 3], [])).toBe(true)
  expect(o.test([1, 2, 3], null)).toBe(false)
  expect(o.test([1, 2, 3], [3, 1])).toBe(true)
  expect(o.test(['1', '2', '3'], [3, 2, 1])).toBe(true)
})

test('operator: option_contains', () => {
  const o = Operators.OPERATOR_OPTION_CONTAINS

  expect(o.test([1, 2, 3], [3, 2, 1])).toBe(true)
  expect(o.test([1, 2, 3], [])).toBe(true)
  expect(o.test([1, 2, 3], null)).toBe(false)
  expect(o.test([1, 2, 3], [3, 1])).toBe(true)
  expect(o.test(['1', '2', '3'], [3, 2, 1])).toBe(false)
})

test('operator: option_empty', () => {
  const o = Operators.OPERATOR_OPTION_EMPTY

  expect(o.test([1, 2, 3])).toBe(false)
  expect(o.test([])).toBe(true)
  expect(o.test(null)).toBe(true)
  expect(o.test(1)).toBe(true)
  expect(o.test([''])).toBe(false)
})