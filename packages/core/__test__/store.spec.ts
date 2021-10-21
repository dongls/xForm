import store, { getRawStore } from '../api/store'
import CONFIG from '../config'
import { FieldConf, FormPreset } from '../model'
import { mockFieldConfs } from './mock/index'

describe('store: reset', () => {
  test('reset config', () => {
    store.resetConfig()
    const config = store.getConfig()
    expect(config).toStrictEqual(CONFIG)
  })

  test('reset preset', () => {
    store.resetPreset()
    expect(store.getPreset()).toBeNull()
  })

  test('reset', () => {
    store.reset()
    const config = store.getConfig()
    const fg = store.findFieldGroups()

    expect(config).toStrictEqual(CONFIG)
    expect(store.getPreset()).toBeNull()
    expect(fg.length).toBe(0)
  })
})

describe('store: register', () => {
  test('register single field', () => {
    store.reset()

    const text = FieldConf.create({ type: 'text' })
    const textarea = FieldConf.create({ type: 'textarea' })
    store.register(text)
    store.register(textarea)

    const raw = getRawStore()
    expect(raw.fields.size).toBe(2)
    expect(raw.fields.has(text.type))
    expect(raw.fields.has(textarea.type))
  })

  test('register many fields', () => {
    store.reset()

    const text = FieldConf.create({ type: 'text' })
    const textarea = FieldConf.create({ type: 'textarea' })
    const select = FieldConf.create({ type: 'select' })
    const checkbox = FieldConf.create({ type: 'checkbox' })

    store.register(text, textarea, [select, checkbox])

    const raw = getRawStore()
    expect(raw.fields.size).toBe(4)
    expect(raw.fields.has(text.type))
    expect(raw.fields.has(textarea.type))
    expect(raw.fields.has(select.type))
    expect(raw.fields.has(checkbox.type))
  })
})

test('store: hasField', () => {
  store.reset()

  const text = FieldConf.create({ type: 'text' })
  store.register(text)

  expect(store.hasFieldConf('text')).toBe(true)
  expect(store.hasFieldConf('textarea')).toBe(false)
})

describe('store: usePreset', () => {
  test('with config', () => {
    const preset: FormPreset = {
      name: 'demo',
      fieldConfs: [],
      config: {
        validation: {
          immediate: false
        }
      }
    }

    store.reset()
    store.usePreset(preset)

    expect(store.isImmediateValidate()).toBe(false)
  })
})

describe('store: useConfig', () => {
  test('default config', () => {
    store.reset()
    const config = store.getConfig()

    expect(config).not.toBeNull()
    expect(config.modes).toBeNull()
    expect(config.validation.immediate).toBe(true)
    expect(config.genName).toBeInstanceOf(Function)
  })

  test('validator.immediate', () => {
    store.resetConfig()
    store.useConfig({ validation: { immediate: false } })

    const config = store.getConfig()
    expect(config.validation.immediate).toBe(false)
  })
})

describe('store: findFieldGroups', () => {
  test('mode is undefined', () => {
    const fields = mockFieldConfs()
    const types = fields.map(i => i.type)
    store.resetConfig()
    store.useConfig({})
    store.register(fields)
    const groups = store.findFieldGroups()
    expect(groups.length).toBe(1)

    const group = groups[0]
    expect(group.types).toEqual(types)
    expect(group.title).toBeUndefined()
  })
})

describe('store: findFieldConf', () => {
  test('subtype', () => {
    store.resetField()

    const subtype = FieldConf.create({
      type: 'super.subtype'
    })

    const supertype = FieldConf.create({
      type: 'super',
      dependencies: [subtype]
    })

    store.register(supertype)
    
    const sup = store.findFieldConf('super')
    const sub = store.findFieldConf('super.subtype')

    expect(sup).toBe(supertype)
    expect(sub).toBe(subtype)
  })
})

