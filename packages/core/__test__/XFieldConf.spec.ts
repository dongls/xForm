import { XFieldConf } from '@model'
import { h } from 'vue'

test('XFieldConf: alias', () => {
  const text = XFieldConf.create({
    type: 'text',
    title: '单行文本',
    icon: 'icon-text',

    setting: { 
      name: 'setting-component', 
      render(){
        return h('div', null, 'mock setting component')
      }
    },
    validator(){/* */}
  })

  const email = XFieldConf.create({
    type: 'email',
    title: '邮箱',
    icon: 'icon-email',
    alias: text,
    validator(){/* */},
    onRemoved(){/* */}
  })
  
  expect(text).toBeInstanceOf(XFieldConf)
  expect(text.onRemoved).toBeNull()

  expect(email).toBeInstanceOf(XFieldConf)
  expect(email.alias).toBeInstanceOf(XFieldConf)

  expect(email.type).toBe('email')
  expect(email.title).toBe('邮箱')
  expect(email.icon).toBe('icon-email')
  expect(email.setting).toBe(text.setting)
  expect(email.validator).not.toBe(text.validator)
  expect(email.onRemoved).toBeInstanceOf(Function)
})
