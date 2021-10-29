import { reset, isImmediateValidate } from '..'
import { FormPreset } from '../../model'
import { usePreset } from '../Preset'

describe('usePreset', () => {
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

    reset()
    usePreset(preset)

    expect(isImmediateValidate()).toBe(false)
  })
})
