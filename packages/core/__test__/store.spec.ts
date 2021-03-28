import store from '../store'
import CONFIG from '../config'
import { XFieldConf } from '../model'
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

describe('store: useConfig', () => {
  test('default config', () => {
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
    store.registerManyField(fields)
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

    const subtype = XFieldConf.create({
      type: 'super.subtype'
    })

    const supertype = XFieldConf.create({
      type: 'super',
      dependencies: [subtype]
    })

    store.registerField(supertype)
    
    const sup = store.findFieldConf('super')
    const sub = store.findFieldConf('super.subtype')

    expect(sup).toBe(supertype)
    expect(sub).toBe(subtype)
  })
})