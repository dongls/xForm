import { XField } from '../model'

test('XField: clone', () => {
  const origin = new XField({
    name: 'origin',
    type: 'text',
    attributes: {
      test: 1
    }
  })

  const child_1 = new XField({
    name: 'child_1',
    type: 'text'
  })

  const child_2 = new XField({
    name: 'child_2',
    type: 'textarea',
    allowClone: false
  })

  origin.fields.push(child_1)
  origin.fields.push(child_2)

  const clone = origin.clone()

  expect(clone).not.toBe(origin)
  expect(clone.name).not.toBe(origin.name)
  expect(clone.attributes.test).toBe(origin.attributes.test)
  expect(clone.fields).toBeInstanceOf(Array)
  expect(clone.fields.length).toBe(1)
  expect(clone.fields[0].name).not.toBe(origin.fields[0].name)
  expect(clone.fields[0].type).toBe(origin.fields[0].type)
})