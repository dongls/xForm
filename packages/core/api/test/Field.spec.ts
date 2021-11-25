import { mockFields, mockOption } from '../../__test__/mock'
import { Field } from '../../model'
import { findField, findModeGroup, hasField, registerField } from '../Field'
import { reset, use, removeField } from '..'
import { store } from '../Store'

describe('registerField', () => {
  test('register single field', () => {
    reset()

    const text = Field.create({ type: 'text' })
    const textarea = Field.create({ type: 'textarea' })
    registerField(text)
    registerField(textarea)

    expect(store.fields.size).toBe(2)
    expect(store.fields.has(text.type))
    expect(store.fields.has(textarea.type))
  })

  test('register many fields', () => {
    reset()

    const text = Field.create({ type: 'text' })
    const textarea = Field.create({ type: 'textarea' })
    const select = Field.create({ type: 'select' })
    const checkbox = Field.create({ type: 'checkbox' })

    registerField(text, textarea, [select, checkbox])

    expect(store.fields.size).toBe(4)
    expect(store.fields.has(text.type))
    expect(store.fields.has(textarea.type))
    expect(store.fields.has(select.type))
    expect(store.fields.has(checkbox.type))
  })

  test('duplicate type', () => {
    reset()

    const text = Field.create({ type: 'text' })
    const text2 = Field.create({ type: 'text' })
    registerField(text, text2)

    const exist = findField('text')
    expect(exist).toBe(text2)
  })
})

test('hasField', () => {
  reset()

  const text = Field.create({ type: 'text' })
  const text2 = Field.create({ type: 'text' })
  registerField(text)

  expect(hasField('text')).toBe(true)
  expect(hasField(text2)).toBe(false)
  expect(hasField('textarea')).toBe(false)
  expect(hasField(null)).toBe(false)
})

describe('findField', () => {
  test('normal case', () => {
    reset()

    const text = Field.create({ type: 'text' })
    const textarea = Field.create({ type: 'textarea' })
    const space = Field.create({ type: ' ' })

    registerField(text, textarea, space)
    
    expect(findField(null)).toBeNull()
    expect(findField('')).toBeNull()
    expect(findField('select')).toBeNull()
    expect(findField('text')).toBe(text)
    expect(findField(' ')).toBe(space)
    expect(findField('textarea')).toBe(textarea)
  })

  test('subtype', () => {
    reset()

    const subtype = Field.create({
      type: 'super.subtype'
    })

    const supertype = Field.create({
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

test('removeField', () => {
  reset()

  const text = Field.create({ type: 'text' })
  const textarea = Field.create({ type: 'textarea' })
  const select = Field.create({ type: 'select' })
  const select2 = Field.create({ type: 'select' })

  registerField(text, textarea, select)

  expect(removeField(null)).toBeNull()
  expect(hasField(text)).toBe(true)
  expect(hasField(textarea)).toBe(true)
  expect(hasField(select)).toBe(true)

  expect(removeField('text')).toBe(text)
  expect(hasField('text')).toBe(false)
  expect(hasField(textarea)).toBe(true)
  expect(hasField(select)).toBe(true)

  expect(removeField(textarea)).toBe(textarea)
  expect(hasField(textarea)).toBe(false)
  expect(hasField(select)).toBe(true)

  expect(removeField(select2)).toBeNull()
  expect(hasField(select))
})

describe('findModeGroup', () => {
  test('mode is undefined', () => {
    reset()

    const fields = mockFields()
    const types = fields.map(i => i.type)
    registerField(fields)
    const groups = findModeGroup()
    expect(groups.length).toBe(1)

    const group = groups[0]
    expect(group.types).toEqual(types)
    expect(group.title).toBeUndefined()
  })

  test('full case', () => {
    reset()

    const options = mockOption()
    use(options)

    const simple = findModeGroup('simple')
    const mode1 = options.config.modes.simple
    expect(simple.length).toBe(1)
    expect(simple[0].fields.map(f => f.type)).toEqual(mode1)
    expect(simple[0].title).toBeUndefined()

    const group = findModeGroup('group')
    const mode2 = options.config.modes.group

    expect(group.length).toBe(mode2.length)
    group.forEach((mg, index) => {
      const types = mg.fields.map(f => f.type)
      const mode = mode2[index]

      expect(types).toEqual(mode.types)
      expect(mg.title).toBe(mode.title)
    })
  })
})
