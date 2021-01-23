import {
  clonePlainObject,
  mergePlainObject
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

describe('lang: mergePlainObject', () => {
  test('simple', () => {
    const x = { a: 1, b: false, e: function(){/* */}, f: [1, 3] }
    const y = { b: 2, e: function(){/* */} }
    const z = { a: 0, c: 'c', b: null, f: [1, 2, 3] } as any
    const o = mergePlainObject({}, x, y, z)

    expect(o).not.toBe(x)
    expect(o.a).toBe(0)
    expect(o.b).toBe(2)
    expect(o.e).toBe(y.e)
    expect(o.f).toBe(z.f)
  })
})