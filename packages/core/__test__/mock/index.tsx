import { XFieldConf, XFormOption } from '../../model'

export function mockFieldConfs(){
  return [
    {
      type: 'text',
      title: '单行文本',
      icon: 'icon-text',
      preview: <div>preview for text</div>,
      build: <div>build for text</div>,
      setting: <div>setting for text</div>,
    },
    {
      type: 'textarea',
      title: '多行文本',
      icon: 'icon-textarea',
      preview: <div>preview for textarea</div>,
      build: <div>build for textarea</div>,
      setting: <div>setting for textarea</div>,
    },
    {
      type: 'select',
      title: '下拉框',
      icon: 'icon-select',
      preview: <div>preview for select</div>,
      build: <div>build for select</div>,
      setting: <div>setting for select</div>,
    },
  ].map(XFieldConf.create)
}

export function mockOption(){
  return {
    preset: {
      name: 'test',
      fieldConfs: mockFieldConfs()
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
        name: 'field_text01',
        title: '单行文本一'
      },
      {
        type: 'textarea',
        name: 'field_textarea01',
        title: '多行文本一'
      },
      {
        type: 'select',
        name: 'field_select01',
        title: '下拉框',
        options: [
          { value: '选项一' },
          { value: '选项二' },
          { value: '选项三' }
        ]
      },
      {
        type: 'text',
        name: 'field_text02',
        title: '单行文本二'
      },
      {
        type: 'textarea',
        name: 'field_textarea02',
        title: '多行文本二'
      }
    ]
  }
}