import { createSchema } from '../api'
import { getPrivateProps } from '../util/lang'

test('validate', async () => {
  const schema = createSchema({
    fields: [
      {}, 
      { title: '字段1' }, 
      { title: '字段2', fields: [{}] },
      { title: '字段3', fields: [{ title: '字段3-1', fields: [{}] }] }
    ]
  })

  const r = await schema.validate()
  expect(r.valid).toBe(false)
  expect(r.result.length).toBe(3)
  const result = r.result
  expect(result[2].fields[0].fields[0].valid).toBe(false)
})

test('FormSchema: private props', () => {
  const schema = createSchema()
  expect(() => getPrivateProps(schema, Symbol())).toThrow()
})