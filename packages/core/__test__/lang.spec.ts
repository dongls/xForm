import {
  clonePlainObject,
  mergePlainObject,
  flat,
  isEmpty
} from '../util/lang'

test('lang: clonePlainObject', () => {
  const origin = { 
    a: 1, 
    b: false,
    c: 'abc',
    d: null,
    e: undefined,
    f: function(){/* */},
    g: { a: 1, b: 'abc' }, 
    h: [1, 2, 3, 4], 
    i: [{ a: 1 }, { a: 1 }]
  } as any
  
  const clone = clonePlainObject(origin)

  expect(origin.g).not.toBe(clone.g)
  expect(origin.f).toBe(clone.f)
  expect(origin).toStrictEqual(clone)
})

test('lang: mergePlainObject', () => {
  const x = { a: 1, b: false, e: function(){/* */}, f: [1, 3], g: 1 }
  const y = { b: 2, e: function(){/* */}, g: undefined } as any
  const z = { a: 0, c: 'c', b: null, f: [1, 2, 3] } as any
  const o = mergePlainObject({}, x, y, z)

  expect(o).not.toBe(x)
  expect(o.a).toBe(z.a)
  expect(o.b).toBe(z.b)
  expect(o.e).toBe(y.e)
  expect(o.f).toBe(z.f)
  expect(o.g).toBe(x.g)
})

test('lang: flat', () => {
  expect(flat(null)).toStrictEqual([])
  expect(flat([1, 2, 3])).toStrictEqual([1, 2, 3])
  expect(flat([1, [2, 3]])).toStrictEqual([1, 2, 3])
  expect(flat([1, [2], [[3]]])).toStrictEqual([1, 2, [3]])
})

test('lang: isEmpty', () => {
  expect(isEmpty(null)).toBe(true)
  expect(isEmpty(undefined)).toBe(true)
  expect(isEmpty('  ')).toBe(true)
  expect(isEmpty([])).toBe(true)
  expect(isEmpty(NaN)).toBe(true)
  expect(isEmpty(Infinity)).toBe(true)
  expect(isEmpty(-Infinity)).toBe(true)
  expect(isEmpty(0)).toBe(false)
  expect(isEmpty({})).toBe(false)
})