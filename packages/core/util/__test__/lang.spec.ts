import {
  clonePlainObject
} from '../lang'

test('test clone plain object', () => {
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