import {
  createSchemaRef,
  findModeGroup,
  getConfig,
  getPreset,
  reset,
  resetConfig,
  resetPreset,
} from '../api'

import { FormField, FormSchema } from '../model'
import { isRef } from 'vue'

describe('createShema', () => {
  test('edge cases', () => {
    const params = [null, undefined, 1, '', 'abc', false, true, NaN]
    for (const param of params) {
      const schema = createSchemaRef(param)
      expect(isRef(schema)).toBeTruthy()
      expect(schema.value).toBeInstanceOf(FormSchema)
      expect(schema.value.fields).toBeInstanceOf(Array)
      expect(schema.value.fields.length).toBe(0)
    }
  })

  test('passing data', () => {
    const schema = createSchemaRef({
      labelSuffix: ':',
      fields: [
        { type: 'text', name: 'a', title: 'a' },
        { type: 'select', name: 'b', title: 'b' },
      ],
      test: '1',
    })

    expect(isRef(schema)).toBeTruthy()
    expect(schema.value.labelSuffix).toBe(':')
    expect(schema.value.test).toBe('1')

    expect(schema.value.fields).toBeInstanceOf(Array)
    expect(schema.value.fields[0]).toBeInstanceOf(FormField)
  })
})

describe('reset', () => {
  test('resetConfig', () => {
    const o = getConfig()
    resetConfig()
    const n = getConfig()
    expect(o).not.toBe(n)
  })

  test('resetPreset', () => {
    resetPreset()
    expect(getPreset()).toBeNull()
  })

  test('reset', () => {
    const o = getConfig()
    reset()
    const n = getConfig()
    const fg = findModeGroup()

    expect(o).not.toBe(n)
    expect(getPreset()).toBeNull()
    expect(fg.length).toBe(0)
  })
})
