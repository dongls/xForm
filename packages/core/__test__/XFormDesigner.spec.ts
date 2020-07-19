import { mount } from '@vue/test-utils'
import { createSchema } from '../api'
import Component from '../component/XFormDesigner/component'

test('displays message', () => {
  const wrapper = mount(Component, {
    props: {
      mode: null,
      schema: createSchema()
    }
  })
  
  expect(wrapper.find('.xform-designer')).not.toBeNull()
})