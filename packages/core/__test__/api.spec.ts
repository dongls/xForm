import { createSchemaRef } from '../api'
import { XField, XSchema } from '../model'
import { isRef } from 'vue'

describe('api: createShema', () => {
  test('edge cases', () => {
    const params = [null, undefined, 1, '', 'abc', false, true, NaN]
    for(const param of params){
      const schema = createSchemaRef(param)
      expect(isRef(schema)).toBeTruthy()
      expect(schema.value).toBeInstanceOf(XSchema)
      expect(schema.value.fields).toBeInstanceOf(Array)
      expect(schema.value.fields.length).toBe(0)
    }
  })

  test('passing data', () => {
    const schema = createSchemaRef({
      labelSuffix: ':',
      fields: [
        { type: 'text', name: 'a', title: 'a' },
        { type: 'select', name: 'b', title: 'b' }
      ],
      test: '1'
    })

    expect(isRef(schema)).toBeTruthy()
    expect(schema.value.labelSuffix).toBe(':')
    expect(schema.value.test).toBe('1')

    expect(schema.value.fields).toBeInstanceOf(Array)
    expect(schema.value.fields[0]).toBeInstanceOf(XField)
  })
})
