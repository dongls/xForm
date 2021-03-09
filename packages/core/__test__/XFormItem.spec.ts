import { mount } from '@vue/test-utils'
import { mockOption } from './mock'
import { XFormItem, store, XField, XFieldConf } from '../index'
import { h } from 'vue'

describe('XFormItem slots: default', () => {
  test('slot is not empty', () => {
    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const content = '<div>mock xform item content</div>'
    const app = { template: `<xform-item>${content}</xform-item>` }
    const wrapper = mount(app, {
      props: { field: field },
      global: { components: { [XFormItem.name]: XFormItem } }
    })

    expect(wrapper.find('.xform-item-title').text()).toBe(field.title)
    expect(wrapper.find('.xform-item-content').html().includes(content)).toBe(true)
    expect(wrapper.element.matches('.xform-item.xform-is-left')).toBe(true)
  })

  test('slot is empty', () => {
    store.reset(mockOption())

    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const app = { template: '<xform-item/>' }
    const wrapper = mount(app, {
      props: { field: field },
      global: { components: { [XFormItem.name]: XFormItem } }
    })

    expect(wrapper.find('.xform-item-title').text()).toBe(field.title)
    expect(wrapper.find('.xform-item-content').html().includes('build for text')).toBe(true)
  })

  test('slot is custom', () => {
    const content = '<div>slot is custom</div>'
    const text = 'build: slot is custom'
    const conf = XFieldConf.create({
      type: 'text',
      title: '单行文本',
      custom: true,
      build: h('div', text)
    })

    store.reset()
    store.registerField(conf)

    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const notEmptySlot = mount(
      { template: `<xform-item>${content}</xform-item>` }, 
      {
        props: { field: field },
        global: { components: { [XFormItem.name]: XFormItem } }
      }
    )
    expect(notEmptySlot.html()).toBe(content)

    const emptySlot = mount(
      { template: '<xform-item/>' }, 
      {
        props: { field: field },
        global: { components: { [XFormItem.name]: XFormItem } }
      }
    )
    expect(emptySlot.html()).toBe(`<div>${text}</div>`)
  })
})