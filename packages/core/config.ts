import { XFormConf } from '@core/model'

const config: XFormConf = {
  modes: {},
  validator: {
    immediate: true
  },
  confirm(message: string){
    return Promise.resolve(confirm(message))
  }
}

export default config