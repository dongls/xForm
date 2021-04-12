import { LogicOperator, LogicRule } from '../model'
import { test as t } from '../util/logic'

describe('logic', () => {
  test('operator lt', () => {  
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: 10 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: '11' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: LogicOperator.LT.value, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LT.value, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator lte', () => {  
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: 10 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: '11' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: LogicOperator.LTE.value, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.LTE.value, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator gt', () => {  
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: '10' }, { a: 10 })).toBe(false)
  
    expect(t({ operator: LogicOperator.GT.value, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GT.value, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator gte', () => {  
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: '10' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: LogicOperator.GTE.value, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.GTE.value, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator eq', () => {  
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: 1 }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: 2 }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: '1' }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: '2' }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: LogicOperator.EQ.value, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.EQ.value, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator ne', () => {
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: 1 }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: 2 }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: '1' }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: '2' }, { a: 1 })).toBe(true)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: LogicOperator.NE.value, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: false }, { a: 10 })).toBe(true)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: LogicOperator.NE.value, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator empty', () => {
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, { a: 1 })).toBe(false)
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, {})).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, { a: null })).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, { a: undefined })).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, { a: false })).toBe(false)
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, { a: [] })).toBe(true)
    expect(t({ operator: LogicOperator.EMPTY.value, name: 'a' }, { a: {} })).toBe(false)
  })

  test('operator contains', () => {
    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: '1' }, { a: '1' })).toBe(true)
    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: '2' }, { a: '1211' })).toBe(true)
    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: 1 }, { a: '1' })).toBe(false)
    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: '' }, { a: '1' })).toBe(false)
    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: null }, { a: '1' })).toBe(false)

    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: 1 }, { a: [1, 2] })).toBe(true)
    expect(t({ operator: LogicOperator.CONTAINS.value, name: 'a', value: null }, { a: [1, 2] })).toBe(false)
  })

  test('operator and', () => {
    const logic: LogicRule = {
      operator: LogicOperator.AND.value,
      condition: [
        { operator: LogicOperator.EQ.value, name: 'a', value: 1 },
        { operator: LogicOperator.LT.value, name: 'b', value: 18 },
        { operator: LogicOperator.EMPTY.value, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(true)
    expect(t(logic, { a: 2, b: 10 })).toBe(false)
    expect(t(logic, { a: 1, b: 20 })).toBe(false)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(false)
  })

  test('operator or', () => {
    const logic: LogicRule = {
      operator: LogicOperator.OR.value,
      condition: [
        { operator: LogicOperator.EQ.value, name: 'a', value: 1 },
        { operator: LogicOperator.LT.value, name: 'b', value: 18 },
        { operator: LogicOperator.EMPTY.value, name: 'c' }
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
      operator: LogicOperator.NOT.value,
      condition: [
        { operator: LogicOperator.EQ.value, name: 'a', value: 1 },
        { operator: LogicOperator.LT.value, name: 'b', value: 18 },
        { operator: LogicOperator.EMPTY.value, name: 'c' }
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
    expect(t({ operator: LogicOperator.LT.value }, 1)).toBe(false)
    expect(t({ operator: 'any', name: 'a', value: 1 } as any, { a: 1 })).toBe(false)
  })
  
  test('complex case', () => {
    const logic: LogicRule = {
      operator: LogicOperator.AND.value,
      condition: [
        { operator: LogicOperator.LT.value, value: 20, name: 'a' },
        { operator: LogicOperator.EQ.value, value: 'test', name: 'b' },
        { operator: LogicOperator.OR.value, condition: [
          { operator: LogicOperator.GT.value, value: 10, name: 'c' },
          { operator: LogicOperator.EQ.value, value: 15, name: 'd' }
        ] }
      ]
    }
    const model = { a: 18, b: 'test', d: 15 }
    expect(t(logic, model)).toBe(true)
  })

})
