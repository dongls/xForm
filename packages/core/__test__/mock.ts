import { XFieldConf, XFormOption } from '@model'
import { h } from 'vue'

export function mockField(){
  return [
    { type: 'text', title: '单行文本', icon: 'icon-text', preview: h('div', ['preview for text']) }, 
    { type: 'textarea', title: '多行文本', icon: 'icon-textarea' },
    { type: 'select', title: '下拉框', icon: 'icon-select' }
  ].map(XFieldConf.create)
}

export function mockOption(){
  return {
    preset: {
      name: 'test',
      fieldConfs: mockField()
    },
    config: {
      modes: {
        simple: ['text', 'textarea'],
        group: [
          { title: '文本字段', types: ['text', 'textarea'] },
          { title: '选择字段', types: ['select'] }
        ]
      }
    }
  } as XFormOption
}

export function mockSchema(){
  return {
    fields: [
      {
        type: 'text',
        name: 'field_abcdef',
        title: '文本一',
        placeholder: '提示信息',
        required: true
      }
    ]
  }
}