import store from '../store'

describe('store: useConfig', () => {
  test('default config', () => {
    const config = store.getConfig()

    expect(config).not.toBeNull()
    expect(config.modes).not.toBeNull()
    expect(config.validator.immediate).toBe(true)
    expect(config.confirm).toBeInstanceOf(Function)
    expect(config.confirm('')).toBeInstanceOf(Promise)
  })

  test('validator.immediate', () => {
    store.resetConfig()
    store.useConfig({ validator: { immediate: false } })

    const config = store.getConfig()
    expect(config.validator.immediate).toBe(false)
  })

})