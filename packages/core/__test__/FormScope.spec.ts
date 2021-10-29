import { createSchema } from '../index'
import { FormField } from '../model'

test('form scope', async () => {
  const schema = createSchema({})
  const field = new FormField()
  const field_2 = new FormField()

  expect(schema.root).toBe(schema)
  expect(schema.parent).toBe(null)
  expect(field.parent).toBeNull()
  expect(field.root).toBeNull()

  schema.push(field)
  schema.insert(0, field_2)

  expect(field.parent).toBe(schema)
  expect(field.root).toBe(schema)
  expect(field_2.parent).toBe(schema)
  expect(schema.indexOf(field_2)).toBe(0)

  field.move(0)
  expect(schema.indexOf(field)).toBe(0)
  expect(schema.indexOf(field_2)).toBe(1)

  const subField = new FormField()
  field.push(subField)
  expect(subField.parent).toBe(field)
  expect(subField.root).toBe(schema)

  await Promise.resolve()

  schema.remove(field)
  expect(field.parent).toBe(null)
  expect(field.root).toBe(null)
  expect(subField.root).toBe(null)
})