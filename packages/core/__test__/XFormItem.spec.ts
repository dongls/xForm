import { mount } from '@vue/test-utils'
import { XFormItem } from '../index'
import { XField } from '../model'

describe('XFormItem slots: default', () => {
  test('not null', () => {
    const field = XField.create({  
      type: 'text',
      name: 'field_text01',
      title: '单行文本一'
    })

    const content = '<div>mock xform item content</div>'
    const app = { template: `<xform-item>${content}</xform-item>` }
    const wrapper = mount(app, {
      props: {
        field: field
      },
      global: {
        components: { [XFormItem.name]: XFormItem }
      }
    })

    expect(wrapper.find('.xform-item-title').text()).toBe(field.title)
    expect(wrapper.find('.xform-item-content').html().includes(content)).toBe(true)
    expect(wrapper.element.matches('.xform-item.xform-is-left')).toBe(true)
  })
})