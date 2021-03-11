import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { mockOption } from './mock'
import { XFormItem, store, XField, XFieldConf } from '../index'
import { EnumLabelPosition, XFORM_FORM_SCHEMA_PROVIDE_KEY } from '../model'
import { createSchemaRef } from '../api'

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

describe('XFormItem props: labelPosition', () => {
  test('default', () => {
    store.reset()

    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const wrapper = mount({ template: '<xform-item/>' }, { 
      props: { field: field }, 
      global: { components: { [XFormItem.name]: XFormItem } } 
    })
    expect(wrapper.find('.xform-item').element.matches('.xform-is-left'))
  })

  test('left', () => {
    store.reset()

    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field },
      global: {
        components: { [XFormItem.name]: XFormItem },
        provide: {
          [XFORM_FORM_SCHEMA_PROVIDE_KEY]: createSchemaRef({ labelPosition: EnumLabelPosition.LEFT })
        }
      }
    })
    expect(wrapper.find('.xform-item').element.matches('.xform-is-left'))
  })

  test('right', () => {
    store.reset()

    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field },
      global: {
        components: { [XFormItem.name]: XFormItem },
        provide: {
          [XFORM_FORM_SCHEMA_PROVIDE_KEY]: createSchemaRef({ labelPosition: EnumLabelPosition.RIGHT })
        }
      }
    })
    expect(wrapper.find('.xform-item').element.matches('.xform-is-right'))
  })

  test('top', () => {
    store.reset()

    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field },
      global: {
        components: { [XFormItem.name]: XFormItem },
        provide: {
          [XFORM_FORM_SCHEMA_PROVIDE_KEY]: createSchemaRef({ labelPosition: EnumLabelPosition.TOP })
        }
      }
    })
    expect(wrapper.find('.xform-item').element.matches('.xform-is-top'))
  })
})

describe('XFormItem props: labelSuffix', () => {
  test('is null', () => {
    store.reset()
  
    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field },
      global: {
        components: { [XFormItem.name]: XFormItem }
      }
    })
    
    expect(wrapper.find('.xform-item-title + span').exists()).toBe(false)
  })

  test('not null', () => {
    store.reset()
  
    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field },
      global: {
        components: { [XFormItem.name]: XFormItem },
        provide: {
          [XFORM_FORM_SCHEMA_PROVIDE_KEY]: createSchemaRef({ labelSuffix: '：' })
        }
      }
    })
    
    const span = wrapper.find('.xform-item-title + span')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('：')
  })
})

describe('XFormItem props: label', () => {
  test('not null', () => {
    store.reset()
  
    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const label = '自定义文本'
    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field, label },
      global: {
        components: { [XFormItem.name]: XFormItem },
        provide: {
          [XFORM_FORM_SCHEMA_PROVIDE_KEY]: createSchemaRef({ labelSuffix: '：' })
        }
      }
    })
    
    const span = wrapper.find('.xform-item-title')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe(label)
  })

  test('not null', () => {
    store.reset()
  
    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const label = false
    const wrapper = mount({ template: '<xform-item/>' }, {
      props: { field: field, label },
      global: {
        components: { [XFormItem.name]: XFormItem },
        provide: {
          [XFORM_FORM_SCHEMA_PROVIDE_KEY]: createSchemaRef({ labelSuffix: '：' })
        }
      }
    })

    const span = wrapper.find('.xform-item-title')
    expect(span.exists()).toBe(false)
  })
})