import store from '@core/store'
import CONFIG from '@core/config'
import { XFieldConf } from '@model'

function mockField(){
  return [
    { type: 'text', title: '单行文本' }, 
    { type: 'textarea', title: '多行文本' },
    { type: 'select', title: '下拉框' }
  ].map(XFieldConf.create)
}

describe('store: reset', () => {
  test('resetConfig', () => {
    store.resetConfig()
    const config = store.getConfig()
    expect(config).toStrictEqual(CONFIG)
  })

  test('resetPreset', () => {
    store.resetPreset()
    // TODO: test preset field
    expect(store.getPreset()).toBeNull()
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
    const fields = mockField()
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