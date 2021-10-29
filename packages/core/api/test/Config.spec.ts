import { reset } from '..'
import {
  resetConfig,
  useConfig,
  getConfig,
  isImmediateValidate,
} from '../Config'

describe('useConfig', () => {
  test('default config', () => {
    reset()
    const config = getConfig()

    expect(config).not.toBeNull()
    expect(config.modes).toBeNull()
    expect(config.validation.immediate).toBe(true)
    expect(config.genName).toBeInstanceOf(Function)
  })

  test('validator.immediate', () => {
    resetConfig()
    useConfig({ validation: { immediate: false } })

    const config = getConfig()
    expect(config.validation.immediate).toBe(false)
    expect(isImmediateValidate()).toBe(false)
  })
})

