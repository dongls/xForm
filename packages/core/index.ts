import './non-standard-prop-compat'

import { App } from 'vue'
import { XFormOption } from './model'
import store from './store'

import XFormDesigner from './component/XFormDesigner/component'
import XFormBuilder from './component/XFormBuilder/component'
import XFormViewer from './component/XFormViewer/component'
import XFormItem from './component/XFormItem/component'

const version = __VERSION__
const install = function(app: App, options: XFormOption){
  if(null != options) store.use(options)

  app.component(XFormDesigner.name, XFormDesigner)
  app.component(XFormBuilder.name, XFormBuilder)
  app.component(XFormViewer.name, XFormViewer)
  app.component(XFormItem.name, XFormItem)
}

const XForm = {
  install,
  store,
  version,
}

export {
  XFormBuilder,
  XFormDesigner,
  XFormItem,
  XFormViewer,
  install,
  store,
  version,
}

export * from './model/exports'
export * from './api'
export default XForm