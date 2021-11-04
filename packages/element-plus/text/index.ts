import { FieldConf } from '@dongls/xform'

import icon from '@common/svg/text.svg'
import text from './text.vue'

export default FieldConf.create({
  icon: icon,
  type: 'text',
  title: '单行文本',
  build: text
})