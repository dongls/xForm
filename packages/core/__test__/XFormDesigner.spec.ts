import { mount } from '@vue/test-utils'
import { createSchema } from '../api'
import { mockOption, mockSchema } from './mock'
import { store, XFormDesigner, XFormItem } from '@core/index'
import { ATTRS, ModeGroup } from '@model'

describe('XFormDesigner props: mode', () => {
  test('mode is null', () => {
    const option = mockOption()
    store.reset(option)
  
    const wrapper = mount(XFormDesigner, {
      props: {
        mode: null,
        schema: createSchema(mockSchema())
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
        schema: createSchema()
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
        schema: createSchema()
      }
    })

    const group = option.config.modes.group as ModeGroup[]
    const groupEl = wrapper.findAll('.xform-designer-field-group')
    const result = groupEl.map(e => {
      const titleEl = e.find(':scope > h3')
      const fieldEl = e.findAll('.xform-designer-field')

      return {
        title: titleEl.exists() ? titleEl.text() : null,
        types: fieldEl.map(f => (f.attributes(ATTRS.XFIELD_TYPE)))
      }
    })
    expect(group).toEqual(result)
  })
})