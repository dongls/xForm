import { FormField, BuiltInDefaultValueType } from '../../model'

test('defaultValue: manual', () => {
  const field_1 = new FormField({
    name: 'field_1',
    type: 'text',
    defaultValue: {
      type: BuiltInDefaultValueType.MANUAL,
      value: 1
    }
  })

  const field_2 = new FormField({
    name: 'field_2',
    type: 'text',
    defaultValue: {
      type: 'xxxx',
      value: 2
    }
  })

  const field_3 = new FormField({
    name: 'field_3',
    type: 'text'
  })

  field_1.setValue(undefined, true)
  field_2.setValue(undefined, true)
  field_3.setValue(undefined, true)

  expect(field_1.value).toBe(1)
  expect(field_2.value).toBe(2)
  expect(field_3.value).toBeUndefined()
})

test('defaultValue: option_first', () => {
  const field_1 = new FormField({
    name: 'field_1',
    type: 'select',
    options: [{ value: 1 }, { value: 2 }],
    defaultValue: {
      type: BuiltInDefaultValueType.OPTION_FIRST
    }
  })

  const field_2 = new FormField({
    name: 'field_2',
    type: 'text',
    defaultValue: {
      type: BuiltInDefaultValueType.OPTION_FIRST
    }
  })

  field_1.setValue(undefined, true)
  field_2.setValue(undefined, true)

  expect(field_1.value).toBe(field_1.options[0].value)
  expect(field_2.value).toBeUndefined()
})

test('defaultValue: option_all', () => {
  const field_1 = new FormField({
    name: 'field_1',
    type: 'select',
    options: [{ value: 1 }, { value: 2 }],
    defaultValue: {
      type: BuiltInDefaultValueType.OPTION_ALL
    }
  })

  const field_2 = new FormField({
    name: 'field_2',
    type: 'text',
    defaultValue: {
      type: BuiltInDefaultValueType.OPTION_ALL
    }
  })

  field_1.setValue(undefined, true)
  field_2.setValue(undefined, true)

  expect(field_1.value).toEqual(field_1.options.map(o => o.value))
  expect(field_2.value).toEqual([])
})

test('defaultValue: date_now', () => {
  const field_1 = new FormField({
    name: 'field_1',
    type: 'date',
    defaultValue: {
      type: BuiltInDefaultValueType.DATE_NOW
    }
  })

  field_1.setValue(undefined, true)
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  expect(field_1.value).toBe(`${year}-${month}-${day}`)
})