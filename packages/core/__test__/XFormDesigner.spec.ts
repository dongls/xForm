import { mount } from '@vue/test-utils'
import { createSchemaRef } from '../api'
import { mockOption, mockSchema } from './mock/index'
import { store, XFormDesigner, XFormItem } from '../index'
import { ModeGroup, PROPS } from '../model'
import { h } from 'vue'

describe('XFormDesigner props: mode', () => {
  test('mode is null', () => {
    const option = mockOption()
    store.reset(option)
  
    const wrapper = mount(XFormDesigner, {
      props: {
        mode: null,
        schema: createSchemaRef(mockSchema())
      },
      global: {
        components: {
          [XFormItem.name]: XFormItem
        }
      }
    })

    const renderFieldText = wrapper.findAll('.xform-designer-field').map(f => f.text())
    const fieldText = option.preset.fieldConfs.map(f => f.title)
    expect(renderFieldText).toEqual(fieldText)
  })

  test('mode is simple', () => {
    const option = mockOption()
    store.reset(option)
  
    const wrapper = mount(XFormDesigner, {
      props: {
        mode: 'simple',
        schema: createSchemaRef()
      }
    })

    const types = option.config.modes.simple as string[]
    const fieldText = types.map(f => store.findFieldConf(f).title)
    const renderFieldText = wrapper.findAll('.xform-designer-field').map(f => f.text())
    expect(renderFieldText).toEqual(fieldText)
  })

  test('mode is group', () => {
    const option = mockOption()
    store.reset(option)
  
    const wrapper = mount(XFormDesigner, {
      props: {
        mode: 'group',
        schema: createSchemaRef()
      }
    })

    const group = option.config.modes.group as ModeGroup[]
    const groupEl = wrapper.findAll('.xform-designer-field-group')
    const result = groupEl.map(e => {
      const titleEl = e.find(':scope > h3')
      const fieldEl = e.findAll('.xform-designer-field')

      return {
        title: titleEl.exists() ? titleEl.text() : null,
        types: fieldEl.map(f => {
          return (f.element as any)[PROPS.XFIELD_TYPE]
        })
      }
    })
    expect(group).toEqual(result)
  })

})

describe('XFormDesigner slots: setting_form', () => {
  test('slot is null', () => {
    const option = mockOption()
    store.reset(option)

    const app = {
      template: `
        <xform-designer v-model:schema="schema"></xform-designer>
      `,
      setup(){
        return {
          schema: createSchemaRef(mockSchema())
        }
      }
    }
    const wrapper = mount(app, {
      global: {
        components: {
          [XFormDesigner.name]: XFormDesigner,  
          [XFormItem.name]: XFormItem
        }
      }
    })

    const setting = wrapper.find('.xform-designer-setting')
    expect(setting.element.children.length).toBe(1)
    expect(setting.element.firstElementChild.matches('.xform-designer-setting-field')).toBe(true)
  })

  test('use preset slot', () => {
    const slotText = 'mock preset setting_form slot'
    const option = mockOption()
    option.preset.slots = {
      'setting_form': h('div', slotText)
    }
    
    store.reset(option)

    const app = {
      template: `
        <xform-designer v-model:schema="schema"></xform-designer>
      `,
      setup(){
        return {
          schema: createSchemaRef(mockSchema())
        }
      }
    }
    const wrapper = mount(app, {
      global: {
        components: {
          [XFormDesigner.name]: XFormDesigner,  
          [XFormItem.name]: XFormItem
        }
      }
    })

    const setting = wrapper.find('.xform-designer-setting')
    expect(setting.element.children.length).toBe(2)
    expect(setting.element.firstElementChild.matches('.xform-tabs')).toBe(true)

    const content = setting.find('.xform-tabs-content')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe(slotText)
  })

  test('use custom slot', () => {
    const slotText = 'mock preset setting_form slot'
    const customText = 'mock custom setting_form slot'
    const option = mockOption()
    option.preset.slots = {
      'setting_form': h('div', slotText)
    }
    
    store.reset(option)

    const app = {
      template: `
        <xform-designer v-model:schema="schema">
          <template #setting_form>
            <div>${customText}</div>
          </template>
        </xform-designer>
      `,
      setup(){
        return {
          schema: createSchemaRef(mockSchema())
        }
      }
    }
    const wrapper = mount(app, {
      global: {
        components: {
          [XFormDesigner.name]: XFormDesigner,  
          [XFormItem.name]: XFormItem
        }
      }
    })

    const setting = wrapper.find('.xform-designer-setting')
    expect(setting.element.children.length).toBe(2)
    expect(setting.element.firstElementChild.matches('.xform-tabs')).toBe(true)
    
    const content = setting.find('.xform-tabs-content')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe(customText)
  })
})

describe('XFormDesigner slots: others', () => {

  test('tool & preview & setting', async () => {
    const option = mockOption()
    store.reset(option)
  
    const toolSlotClass = 'is-slot-tool'
    const toolSlotText = 'mock tool slot'
    
    // preview_name_[name]
    const previewNameSlotClass = 'is-slot-preview-name'
    const previewNameSlotText = 'mock preview name slot'

    // preview_type_[type]
    const previewTypeSlotClass = 'is-slot-preview-type'
    const previewTypeSlotText = 'mock preview type slot'

    // setting_name_[name]
    const settingNameSlotClass = 'is-slot-setting-name'
    const settingNameSlotText = 'mock setting name slot'

    // setting_type_[type]
    const settingTypeSlotClass = 'is-slot-setting-name'
    const settingTypeSlotText = 'mock setting name slot'

    const app = {
      template: `
        <xform-designer v-model:schema="schema">
          <template #tool>
            <div class="${toolSlotClass}">${toolSlotText}</div>
          </template>
          <template #preview_name_field_text01>
            <div class="${previewNameSlotClass}">${previewNameSlotText}</div>
          </template>
          <template #preview_type_text>
            <div class="${previewTypeSlotClass}">${previewTypeSlotText}</div>
          </template>
          <template #setting_name_field_textarea01>
            <div class="is-setting-slot ${settingNameSlotClass}">${settingNameSlotText}</div>
          </template>
          <template #setting_type_textarea>
            <div class="is-setting-slot ${settingTypeSlotClass}">${settingTypeSlotText}</div>
          </template>
        </xform-designer>
      `,
      setup(){
        return {
          schema: createSchemaRef(mockSchema())
        }
      }
    }
  
    const wrapper = mount(app, {
      global: {
        components: {
          [XFormDesigner.name]: XFormDesigner,  
          [XFormItem.name]: XFormItem
        }
      }
    })

    const toolSlot = wrapper.find('.' + toolSlotClass)
    expect(toolSlot.exists()).toBe(true)
    expect(toolSlot.text()).toBe(toolSlotText)
    expect(toolSlot.element.parentElement.classList.contains('xform-designer-main')).toBe(true)
    expect(toolSlot.element.nextElementSibling.classList.contains('xform-designer-board')).toBe(true)
    
    const previewNameSlot = wrapper.findAll('.' + previewNameSlotClass)
    expect(previewNameSlot.length).toBe(1)
    expect(previewNameSlot[0].text()).toBe(previewNameSlotText)
    expect(previewNameSlot[0].element.matches('.xform-preview-text > .xform-item > .xform-item-content > .' + previewNameSlotClass)).toBe(true)
    
    const previewTypeSlot = wrapper.findAll('.' + previewTypeSlotClass)
    expect(previewTypeSlot.length).toBe(1)
    expect(previewTypeSlot[0].text()).toBe(previewTypeSlotText)
    expect(previewTypeSlot[0].element.matches('.xform-preview-text > .xform-item > .xform-item-content > .' + previewTypeSlotClass)).toBe(true)

    await wrapper.find('#preview_field_textarea01 .xform-preview-cover').trigger('click')
    const settingNameSlot = wrapper.find('.is-setting-slot')
    expect(settingNameSlot.exists()).toBe(true)
    expect(settingNameSlot.element.matches('.' + settingNameSlotClass)).toBe(true)
    expect(settingNameSlot.text()).toBe(settingNameSlotText)

    await wrapper.find('#preview_field_textarea02 .xform-preview-cover').trigger('click')
    const settingTypeSlot = wrapper.find('.is-setting-slot')
    expect(settingTypeSlot.exists()).toBe(true)
    expect(settingTypeSlot.element.matches('.' + settingTypeSlotClass)).toBe(true)
    expect(settingTypeSlot.text()).toBe(settingTypeSlotText)
  })
})
