import { reset, isImmediateValidate } from '..'
import { FormPreset } from '../../model'
import { useApi, usePreset } from '../Exports'

describe('usePreset', () => {
  test('with config', () => {
    const preset: FormPreset = {
      name: 'test',
      install(){
        const api = useApi()
        api.useConfig({
          validation: {
            immediate: false
          }
        })
      }
    }

    reset()
    usePreset(preset)

    expect(isImmediateValidate()).toBe(false)
  })
})
