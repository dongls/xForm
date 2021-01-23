import { createSchema } from '../api'
import { XField } from '@model'

describe('api: createShema', () => {
  test('edge cases', () => {
    const params = [null, undefined, 1, '', 'abc', false, true, NaN]
    for(const param of params){
      const schema = createSchema(param)
      expect(schema).not.toBeNull()
      expect(Object.keys(schema).length).toBe(1)
      expect(schema.fields).toBeInstanceOf(Array)
      expect(schema.fields.length).toBe(0)
    }
  })

  test('passing data', () => {
    const schema = createSchema({
      labelSuffix: ':',
      fields: [
        { type: 'text', name: 'a', title: 'a' },
        { type: 'select', name: 'b', title: 'b' }
      ],
      test: '1'
    })

    expect(schema).not.toBeNull()
    expect(schema.labelSuffix).toBe(':')
    expect(schema.test).toBe('1')

    expect(schema.fields).toBeInstanceOf(Array)
    expect(schema.fields[0]).toBeInstanceOf(XField)
  })
})
