import { EnumLogicOperate, Logic, test as t } from '../util/logic'

describe('logic', () => {
  test('operator lt', () => {  
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: 10 }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: '11' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: EnumLogicOperate.LT, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LT, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator lte', () => {  
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: 1 }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: 11 }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: 10 }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: '1' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: '11' }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.LTE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator gt', () => {  
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: '10' }, { a: 10 })).toBe(false)
  
    expect(t({ operator: EnumLogicOperate.GT, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GT, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator gte', () => {  
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: 1 }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: 11 }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: '1' }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: '11' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: '10' }, { a: 10 })).toBe(true)
  
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.GTE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator eq', () => {  
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: 1 }, { a: 1 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: 2 }, { a: 1 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: '1' }, { a: 1 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: '2' }, { a: 1 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: EnumLogicOperate.EQ, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: false }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EQ, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })
  
  test('operator ne', () => {
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: 1 }, { a: 1 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: 2 }, { a: 1 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: '1' }, { a: 1 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: '2' }, { a: 1 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: '' }, { a: 0 })).toBe(false)

    expect(t({ operator: EnumLogicOperate.NE, name: 'a' }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: 10 }, { })).toBe(false)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: false }, { a: 10 })).toBe(true)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: [] }, { a: 10 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.NE, name: 'a', value: {} }, { a: 10 })).toBe(false)
  })

  test('operator empty', () => {
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, { a: 1 })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, {})).toBe(true)
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, { a: null })).toBe(true)
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, { a: undefined })).toBe(true)
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, { a: false })).toBe(false)
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, { a: [] })).toBe(true)
    expect(t({ operator: EnumLogicOperate.EMPTY, name: 'a' }, { a: {} })).toBe(false)
  })

  test('operator and', () => {
    const logic: Logic = {
      operator: EnumLogicOperate.AND,
      condition: [
        { operator: EnumLogicOperate.EQ, name: 'a', value: 1 },
        { operator: EnumLogicOperate.LT, name: 'b', value: 18 },
        { operator: EnumLogicOperate.EMPTY, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(true)
    expect(t(logic, { a: 2, b: 10 })).toBe(false)
    expect(t(logic, { a: 1, b: 20 })).toBe(false)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(false)
  })

  test('operator or', () => {
    const logic: Logic = {
      operator: EnumLogicOperate.OR,
      condition: [
        { operator: EnumLogicOperate.EQ, name: 'a', value: 1 },
        { operator: EnumLogicOperate.LT, name: 'b', value: 18 },
        { operator: EnumLogicOperate.EMPTY, name: 'c' }
      ]
    }

    expect(t(logic, { a: 1, b: 10 })).toBe(true)
    expect(t(logic, { a: 2, b: 10 })).toBe(true)
    expect(t(logic, { a: 1, b: 20 })).toBe(true)
    expect(t(logic, { a: 1, b: 10, c: 'c' })).toBe(true)
    expect(t(logic, { c: 'c' })).toBe(false)
  })

  test('operator not', () => {
    const logic: Logic = {
      operator: EnumLogicOperate.NOT,
      condition: [
        { operator: EnumLogicOperate.EQ, name: 'a', value: 1 },
        { operator: EnumLogicOperate.LT, name: 'b', value: 18 },
        { operator: EnumLogicOperate.EMPTY, name: 'c' }
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
    expect(t({ operator: EnumLogicOperate.LT }, 1)).toBe(false)
    expect(t({ operator: 'any', name: 'a', value: 1 } as any, { a: 1 })).toBe(false)
  })
  
  test('complex case', () => {
    const logic: Logic = {
      operator: EnumLogicOperate.AND,
      condition: [
        { operator: EnumLogicOperate.LT, value: 20, name: 'a' },
        { operator: EnumLogicOperate.EQ, value: 'test', name: 'b' },
        { operator: EnumLogicOperate.OR, condition: [
          { operator: EnumLogicOperate.GT, value: 10, name: 'c' },
          { operator: EnumLogicOperate.EQ, value: 15, name: 'd' }
        ] }
      ]
    }
    const model = { a: 18, b: 'test', d: 15 }
    expect(t(logic, model)).toBe(true)
  })

})
