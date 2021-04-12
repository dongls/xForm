import { FieldConf } from '../model'
import { h } from 'vue'

test('FieldConf: alias', () => {
  const text = FieldConf.create({
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

  const email = FieldConf.create({
    type: 'email',
    title: '邮箱',
    icon: 'icon-email',
    alias: text,
    validator(){ return Promise.resolve() },
    onRemoved(){/* */}
  })
  
  expect(text).toBeInstanceOf(FieldConf)
  expect(text.onRemoved).toBeNull()

  expect(email).toBeInstanceOf(FieldConf)
  expect(email.alias).toBeInstanceOf(FieldConf)

  expect(email.type).toBe('email')
  expect(email.title).toBe('邮箱')
  expect(email.icon).toBe('icon-email')
  expect(email.setting).toBe(text.setting)
  expect(email.validator).not.toBe(text.validator)
  expect(email.onRemoved).toBeInstanceOf(Function)
})
