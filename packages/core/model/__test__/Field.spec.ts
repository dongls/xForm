import { Field } from '..'
import { h } from 'vue'
import { useApi } from '../../api/Exports'

describe('Field: alias', () => {
  test('is string', () => {
    const api = useApi()
    const text = Field.create({
      type: 'text',
      title: '单行文本',
      icon: 'icon-text',
      setting: { 
        name: 'setting-component', 
        render(){
          return h('div', null, 'mock setting component')
        }
      },
      validator(){ return Promise.resolve() }
    })

    const email = Field.create({
      type: 'email',
      title: '邮箱',
      icon: 'icon-email',
      alias: 'text',
      validator(){ return Promise.resolve() },
      onRemoved(){/* */}
    })
    
    const phone = Field.create({
      type: 'phone',
      title: '手机',
      alias: 'email'
    })

    api.reset()
    api.registerField(text, email)

    expect(text).toBeInstanceOf(Field)
    expect(text.onRemoved).toBeNull()

    expect(email).toBeInstanceOf(Field)
    expect(email.type).toBe('email')
    expect(email.title).toBe('邮箱')
    expect(email.icon).toBe('icon-email')
    expect(email.setting).toBe(text.setting)
    expect(email.validator).not.toBe(text.validator)
    expect(email.onRemoved).toBeInstanceOf(Function)

    expect(phone.title).toBe('手机')
    expect(phone.setting).toBe(text.setting)
    expect(phone.validator).not.toBe(text.validator)
    expect(phone.onRemoved).toBe(email.onRemoved)
  })

  test('is Field', () => {
    const text = Field.create({
      type: 'text',
      title: '单行文本',
      icon: 'icon-text',
      setting: { 
        name: 'setting-component', 
        render(){
          return h('div', null, 'mock setting component')
        }
      },
      validator(){ return Promise.resolve() }
    })
  
    const email = Field.create({
      type: 'email',
      title: '邮箱',
      icon: 'icon-email',
      alias: text,
      validator(){ return Promise.resolve() },
      onRemoved(){/* */}
    })
    
    expect(text).toBeInstanceOf(Field)
    expect(text.onRemoved).toBeNull()
  
    expect(email).toBeInstanceOf(Field)
    expect(email.type).toBe('email')
    expect(email.title).toBe('邮箱')
    expect(email.icon).toBe('icon-email')
    expect(email.setting).toBe(text.setting)
    expect(email.validator).not.toBe(text.validator)
    expect(email.onRemoved).toBeInstanceOf(Function)
  })
})

test('Field: available', () => {
  const field1 = Field.create({})
  const field2 = Field.create({ type: 'f' })
  
  expect(field1.available).toBe(false)
  expect(field2.available).toBe(true)
})