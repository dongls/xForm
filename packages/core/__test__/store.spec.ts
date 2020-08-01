import store from '../store'

describe('store: useConfig', () => {
  test('default config', () => {
    const config = store.getConfig()

    expect(config).not.toBeNull()
    expect(config.modes).not.toBeNull()
    expect(config.validation.immediate).toBe(true)
    expect(config.confirm).toBeInstanceOf(Function)
    expect(config.confirm('')).toBeInstanceOf(Promise)
  })

  test('validator.immediate', () => {
    store.resetConfig()
    store.useConfig({ validation: { immediate: false } })

    const config = store.getConfig()
    expect(config.validation.immediate).toBe(false)
  })

})