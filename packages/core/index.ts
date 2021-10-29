import { App } from 'vue'
import { FormOption } from './model'
import { use } from './api'

import FormDesigner, { FormDesignerApi } from './component/FormDesigner/component'
import FormBuilder, { FormBuilderApi } from './component/FormBuilder/component'
import FormViewer from './component/FormViewer/component'
import FormItem from './component/FormItem/component'

const version = __VERSION__
const install = function(app: App, options: FormOption){
  if(null != options) use(options)

  app.component(FormDesigner.name, FormDesigner)
  app.component(FormBuilder.name, FormBuilder)
  app.component(FormViewer.name, FormViewer)
  app.component(FormItem.name, FormItem)
}

const XForm = {
  install,
  version,
}

export {
  FormBuilderApi,
  FormDesignerApi,
  install,
  version,
}

export * from './model/exports'
export * from './api/Exports'
export default XForm