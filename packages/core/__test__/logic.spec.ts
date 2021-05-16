import { LogicOperator, LogicRule } from '../model'
import { test as t } from '../logic'

describe('logic', () => {
  test('operator lt', () => {  
    expect(t({ operator: LogicOperator.LT, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: 10 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: '11' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: LogicOperator.LT, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator lte', () => {  
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: 10 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: '11' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: LogicOperator.LTE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator gt', () => {  
    expect(t({ operator: LogicOperator.GT, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
  
    expect(t({ operator: LogicOperator.GT, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator gte', () => {  
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: LogicOperator.GTE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator eq', () => {  
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: 1 }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: 2 }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: '1' }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: '2' }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: LogicOperator.EQ, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator ne', () => {
    expect(t({ operator: LogicOperator.NE, name: 'a', value: 1 }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: 2 }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: '1' }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: '2' }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: LogicOperator.NE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: false }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.NE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator empty', () => {
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, {})).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, { a: null })).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, { a: undefined })).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, { a: false })).toBe(false)
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, { a: [] })).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY, name: 'a' }, { a: {} })).toBe(false)
  })

  test('operator contains', () => {
    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: '1' }, { a: '1' })).toBe(true)
    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: '2' }, { a: '1211' })).toBe(true)
    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: 1 }, { a: '1' })).toBe(false)
    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: '' }, { a: '1' })).toBe(false)
    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: null }, { a: '1' })).toBe(false)

    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: 1 }, { a: [1, 2] })).toBe(true)
    expect(t({ operator: LogicOperator.CONTAINS, name: 'a', value: null }, { a: [1, 2] })).toBe(false)
  })

  test('operator and', () => {
    const logic: LogicRule = {
      operator: LogicOperator.AND,
      condition: [
        { operator: LogicOperator.EQ, name: 'a', value: 1 },
        { operator: LogicOperator.LT, name: 'b', value: 18 },
        { operator: LogicOperator.EMPTY, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(true)
    expect(t(logic, { a: 2, b: 10 })).toBe(false)
    expect(t(logic, { a: 1, b: 20 })).toBe(false)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(false)
  })

  test('operator or', () => {
    const logic: LogicRule = {
      operator: LogicOperator.OR,
      condition: [
        { operator: LogicOperator.EQ, name: 'a', value: 1 },
        { operator: LogicOperator.LT, name: 'b', value: 18 },
        { operator: LogicOperator.EMPTY, name: 'c' }
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
      operator: LogicOperator.NOT,
      condition: [
        { operator: LogicOperator.EQ, name: 'a', value: 1 },
        { operator: LogicOperator.LT, name: 'b', value: 18 },
        { operator: LogicOperator.EMPTY, name: 'c' }
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
    expect(t({ operator: LogicOperator.LT }, 1)).toBe(false)
    expect(t({ operator: 'any', name: 'a', value: 1 } as any, { a: 1 })).toBe(false)
  })
  
  test('complex case', () => {
    const logic: LogicRule = {
      operator: LogicOperator.AND,
      condition: [
        { operator: LogicOperator.LT, value: 20, name: 'a' },
        { operator: LogicOperator.EQ, value: 'test', name: 'b' },
        { operator: LogicOperator.OR, condition: [
          { operator: LogicOperator.GT, value: 10, name: 'c' },
          { operator: LogicOperator.EQ, value: 15, name: 'd' }
        ] }
      ]
    }
    const model = { a: 18, b: 'test', d: 15 }
    expect(t(logic, model)).toBe(true)
  })

})
