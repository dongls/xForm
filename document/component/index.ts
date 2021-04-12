import { App } from 'vue'

import Modal from './Modal.vue'
import FooterGuide from './FooterGuide.vue'

export { useNotification } from './Notification'

export default function(app: App){
  app.component(Modal.name, Modal)
  app.component(FooterGuide.name, FooterGuide)
}