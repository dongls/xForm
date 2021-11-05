import { FormPreset } from '@dongls/xform'

import Text from './text'
import Textare from './textarea'
import Divider from './divider'

const ElementPlus: FormPreset = {
  name: 'element-plus',
  version: __VERSION__,
  fieldConfs: [
    Text,
    Textare,
    Divider
  ]
}

export default ElementPlus