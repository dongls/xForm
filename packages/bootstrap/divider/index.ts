import { FieldConf } from '@dongls/xform'
import icon from '@common/svg/divider.svg'

import divider from './divider.vue'
import setting from './setting.vue'

export default FieldConf.create({
  icon: icon,
  type: 'divider',
  title: '分割线',
  custom: true,
  setting: setting,
  build: divider,
  view: divider,
  onCreate(field, params, init){
    if(init){
      field.attributes.type = 'solid'
      field.attributes.top = 0
      field.attributes.bottom = 0
    }
  },
  operators: false
})