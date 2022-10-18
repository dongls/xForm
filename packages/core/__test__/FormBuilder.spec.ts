import { mount } from '@vue/test-utils'
import { mockOption } from './mock/index'
import { createReactiveSchema, reset } from '../api'
import { ref } from 'vue'

import FormBuilder from '../component/FormBuilder/component'
import FormItem from '../component/FormItem/component'

function createGlobal(){
  return {
    components: {
      [FormBuilder.name]: FormBuilder,
      [FormItem.name]: FormItem
    }
  }
}

describe('FormBuilder props: tag', () => {
  test('default', async () => {
    const option = mockOption()
    reset(option)
    
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
          schema: createReactiveSchema()
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
    reset(option)
    
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
          schema: createReactiveSchema()
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

describe('FormBuilder render', () => {
  test('field is hidden', () => {
    const option = mockOption()
    reset(option)

    const schema = createReactiveSchema({
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

describe('FormBuilder validate', () => {
  test('simple case', async () => {
    reset(mockOption())

    const component = {  
      template: `
        <xform-builder :schema="schema" @submit="onSubmit">
          <input type="submit" value="submit">
        </xform-builder>
      `,
      setup(){
        const validate = ref(null)
        const schema = createReactiveSchema({
          fields: [
            { type: 'text', name: 'field_01', title: '文本一', required: true },
            { type: 'text', name: 'field_02', title: '文本二' },
          ]
        })
    
        return {
          validate,
          schema,
          onSubmit: (event: any) => validate.value = event
        }
      },
      ...createGlobal()
    }

    const wrapper = mount(component, { attachTo: document.body })

    const submit = wrapper.find('input[type="submit"]')
    await submit.trigger('click')

    const r1 = await wrapper.vm.validate().catch((e: any) => e)
    expect(r1.valid).toBe(false)
    
    const r1_text01 = wrapper.find('.xform-item[name="field_01"]')
    const r1_text01Message = r1_text01.find('.xform-item-message')
    expect(r1_text01.classes()).toContain('xform-is-error')
    expect(r1_text01Message.exists()).toBe(true)
    expect(r1_text01Message.text()).toBe('必填')

    const r1_text02 = wrapper.find('.xform-item[name="field_02"]')
    const r1_text02Message = r1_text02.find('.xform-item-message')
    expect(r1_text02.classes()).not.toContain('xform-is-error')
    expect(r1_text02Message.exists()).toBe(false)

    await wrapper.find('.xform-item[name="field_01"] input[type="text"]').setValue('1')
    await submit.trigger('click')
    const r2 = await wrapper.vm.validate().catch((e: any) => e)
    expect(r2.valid).toBe(true)

    const r2_text01 = wrapper.find('.xform-item[name="field_01"]')
    const r2_text01Message = r2_text01.find('.xform-item-message')
    expect(r2_text01.classes()).not.toContain('xform-is-error')
    expect(r2_text01Message.exists()).toBe(false)
    expect(wrapper.vm.schema.model['field_01']).toBe('1')
  })
})