import { mount } from '@vue/test-utils'
import { createSchemaRef } from '../api'
import { mockOption, mockSchema } from './mock/index'
import { store, XFormDesigner, XFormItem } from '../index'
import { ModeGroup, PROPS } from '../model'

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

describe('XFormDesigner slots', () => {

  test('tool & preview & setting', () => {
    const option = mockOption()
    store.reset(option)
  
    const toolSlotClass = 'is-slot-tool'
    const toolSlotText = 'mock tool slot text'
    
    // preview_name_[name]
    const previewNameSlotClass = 'is-slot-preview-name'
    const previewNameSlotText = 'mock preview name slot text'

    // preview_type_[type]
    const previewTypeSlotClass = 'is-slot-preview-type'
    const previewTypeSlotText = 'mock preview type slot text'
    
    // TEST: setting_type_[type]
    // TEST: setting_name_[name]
    const app = {
      template: `
        <xform-designer v-model:schema="schema">
          <template #tool>
            <div class="${toolSlotClass}">${toolSlotText}</div>
          </template>
          <template #preview_name_field_text01>
            <div class="${previewNameSlotClass}">${previewNameSlotText}</div>
          </template>
          <template #preview_type_textarea>
            <div class="${previewTypeSlotClass}">${previewTypeSlotText}</div>
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
    expect(previewTypeSlot.length).toBe(2)
    expect(previewTypeSlot[0].text()).toBe(previewTypeSlotText)
    expect(previewTypeSlot[0].element.matches('.xform-preview-textarea > .xform-item > .xform-item-content > .' + previewTypeSlotClass)).toBe(true)
  })
})