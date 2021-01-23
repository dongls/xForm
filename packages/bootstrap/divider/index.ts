import { XFieldConf } from '@dongls/xform'
import icon from '@common/svg/divider.svg'

import divider from './divider.vue'
import setting from './setting.vue'

export default XFieldConf.create({
  icon: icon,
  type: 'divider',
  title: '分割线',
  custom: true,
  setting: setting,
  build: divider,
  view: divider
})