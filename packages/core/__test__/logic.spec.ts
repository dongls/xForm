import { BuiltInLogicOperator, LogicRule } from '../model'
import { test as t } from '../logic'

describe('logic', () => {
  test('operator lt', () => {  
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: 10 }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: '11' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator lte', () => {  
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: 10 }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: '11' }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LTE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator gt', () => {  
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
  
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GT, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator gte', () => {  
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.GTE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator eq', () => {  
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: 1 }, { a: 1 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: 2 }, { a: 1 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: '1' }, { a: 1 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: '2' }, { a: 1 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EQ, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator ne', () => {
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: 1 }, { a: 1 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: 2 }, { a: 1 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: '1' }, { a: 1 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: '2' }, { a: 1 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: false }, { a: 10 })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.NE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator empty', () => {
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, { a: 1 })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, {})).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, { a: null })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, { a: undefined })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, { a: false })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, { a: [] })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.EMPTY, name: 'a' }, { a: {} })).toBe(false)
  })

  test('operator contains', () => {
    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: '1' }, { a: '1' })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: '2' }, { a: '1211' })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: 1 }, { a: '1' })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: '' }, { a: '1' })).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: null }, { a: '1' })).toBe(false)

    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: 1 }, { a: [1, 2] })).toBe(true)
    expect(t({ operator: BuiltInLogicOperator.CONTAINS, name: 'a', value: null }, { a: [1, 2] })).toBe(false)
  })

  test('operator and', () => {
    const logic: LogicRule = {
      operator: BuiltInLogicOperator.AND,
      condition: [
        { operator: BuiltInLogicOperator.EQ, name: 'a', value: 1 },
        { operator: BuiltInLogicOperator.LT, name: 'b', value: 18 },
        { operator: BuiltInLogicOperator.EMPTY, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(true)
    expect(t(logic, { a: 2, b: 10 })).toBe(false)
    expect(t(logic, { a: 1, b: 20 })).toBe(false)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(false)
  })

  test('operator or', () => {
    const logic: LogicRule = {
      operator: BuiltInLogicOperator.OR,
      condition: [
        { operator: BuiltInLogicOperator.EQ, name: 'a', value: 1 },
        { operator: BuiltInLogicOperator.LT, name: 'b', value: 18 },
        { operator: BuiltInLogicOperator.EMPTY, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(true)
    expect(t(logic, { a: 2, b: 10 })).toBe(true)
    expect(t(logic, { a: 1, b: 20 })).toBe(true)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(true)
    expect(t(logic, { c: 'c' })).toBe(false)
  })

  test('operator not', () => {
    const logic: LogicRule = {
      operator: BuiltInLogicOperator.NOT,
      condition: [
        { operator: BuiltInLogicOperator.EQ, name: 'a', value: 1 },
        { operator: BuiltInLogicOperator.LT, name: 'b', value: 18 },
        { operator: BuiltInLogicOperator.EMPTY, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(false)
    expect(t(logic, { a: 2, b: 10 })).toBe(false)
    expect(t(logic, { a: 1, b: 20 })).toBe(false)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(false)
    expect(t(logic, { c: 'c' })).toBe(true)
  })

  test('edge case', () => {
    expect(t(null, null)).toBe(false)
    expect(t({} as any, null)).toBe(false)
    expect(t({ operator: BuiltInLogicOperator.LT }, 1)).toBe(false)
    expect(t({ operator: 'any', name: 'a', value: 1 } as any, { a: 1 })).toBe(false)
  })
  
  test('complex case', () => {
    const logic: LogicRule = {
      operator: BuiltInLogicOperator.AND,
      condition: [
        { operator: BuiltInLogicOperator.LT, value: 20, name: 'a' },
        { operator: BuiltInLogicOperator.EQ, value: 'test', name: 'b' },
        { operator: BuiltInLogicOperator.OR, condition: [
          { operator: BuiltInLogicOperator.GT, value: 10, name: 'c' },
          { operator: BuiltInLogicOperator.EQ, value: 15, name: 'd' }
        ] }
      ]
    }
    const model = { a: 18, b: 'test', d: 15 }
    expect(t(logic, model)).toBe(true)
  })

})
