import { mockFieldConfs } from '../../__test__/mock'
import { FieldConf } from '../../model'
import { findField, findModeGroup, hasField, registerField } from '../Field'
import { reset } from '..'
import { store } from '../Store'

describe('registerField', () => {
  test('register single field', () => {
    reset()

    const text = FieldConf.create({ type: 'text' })
    const textarea = FieldConf.create({ type: 'textarea' })
    registerField(text)
    registerField(textarea)

    expect(store.fields.size).toBe(2)
    expect(store.fields.has(text.type))
    expect(store.fields.has(textarea.type))
  })

  test('register many fields', () => {
    reset()

    const text = FieldConf.create({ type: 'text' })
    const textarea = FieldConf.create({ type: 'textarea' })
    const select = FieldConf.create({ type: 'select' })
    const checkbox = FieldConf.create({ type: 'checkbox' })

    registerField(text, textarea, [select, checkbox])

    expect(store.fields.size).toBe(4)
    expect(store.fields.has(text.type))
    expect(store.fields.has(textarea.type))
    expect(store.fields.has(select.type))
    expect(store.fields.has(checkbox.type))
  })
})

test('hasField', () => {
  reset()

  const text = FieldConf.create({ type: 'text' })
  registerField(text)

  expect(hasField('text')).toBe(true)
  expect(hasField('textarea')).toBe(false)
})

describe('findModeGroup', () => {
  test('mode is undefined', () => {
    reset()

    const fields = mockFieldConfs()
    const types = fields.map(i => i.type)
    registerField(fields)
    const groups = findModeGroup()
    expect(groups.length).toBe(1)

    const group = groups[0]
    expect(group.types).toEqual(types)
    expect(group.title).toBeUndefined()
  })
})

describe('findField', () => {
  test('subtype', () => {
    reset()

    const subtype = FieldConf.create({
      type: 'super.subtype'
    })

    const supertype = FieldConf.create({
      type: 'super',
      dependencies: [subtype]
    })

    registerField(supertype)
    
    const sup = findField('super')
    const sub = findField('super.subtype')

    expect(sup).toBe(supertype)
    expect(sub).toBe(subtype)
  })
})
