import { createSchema } from '../index'

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
  
  expect((schema as any).props).toBeInstanceOf(Function)
  expect(() => (schema as any).props()).toThrow()
})