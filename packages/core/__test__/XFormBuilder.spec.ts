import { mount } from '@vue/test-utils'
import { mockOption } from './mock/index'
import { store, XFormBuilder, XFormItem, createSchemaRef } from '../index'
import { ref } from 'vue'

function createGlobal(){
  return {
    components: {
      [XFormBuilder.name]: XFormBuilder,
      [XFormItem.name]: XFormItem
    }
  }
}

describe('XFormBuilder props: tag', () => {
  test('default', async () => {
    const option = mockOption()
    store.reset(option)
    
    const component = {
      template: `
        <xform-builder :schema="schema" @submit="onSubmit">
          <input type="submit" value="submit">
        </xform-builder>
      `,
      setup(){
        const event = ref(null)
        return {
          event,
          onSubmit: (e: any) => event.value = e,
          schema: createSchemaRef()
        }
      },
      ...createGlobal()
    }

    const wrapper = mount(component, { attachTo: document.body })
    expect(wrapper.element.tagName == 'form')

    const input = wrapper.find('input[type="submit"]')
    await input.trigger('click')
    expect(wrapper.vm.event).toBeInstanceOf(Function)
  })

  test('tag is div', async () => {
    const option = mockOption()
    store.reset(option)
    
    const component = {
      template: `
        <xform-builder :schema="schema" @submit="onSubmit" tag="div">
          <input type="submit" value="submit">
        </xform-builder>
      `,
      setup(){
        const event = ref(null)
        return {
          event,
          onSubmit: (e: any) => event.value = e,
          schema: createSchemaRef()
        }
      },
      ...createGlobal()
    }

    const wrapper = mount(component, { attachTo: document.body })
    expect(wrapper.element.tagName == 'div')

    const input = wrapper.find('input[type="submit"]')
    await input.trigger('click')
    expect(wrapper.vm.event).toBeNull()
  })
})

describe('XFormBuilder render', () => {
  test('field is hidden', () => {
    const option = mockOption()
    store.reset(option)

    const schema = createSchemaRef({
      fields: [
        { type: 'text', name: 'field_01', title: '文本一', hidden: true },
        { type: 'textarea', name: 'field_02', title: '多行文本一' }
      ]
    })

    const app = { template: '<xform-builder/>' }
    const wrapper = mount(app, {
      props: { schema },
      global: createGlobal()
    })

    expect(wrapper.find('.xform-item[name="field_01"]').exists()).toBe(false)
    expect(wrapper.find('.xform-item[name="field_02"]').exists()).toBe(true)
  })
})