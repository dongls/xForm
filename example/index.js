import Vue from 'vue';
import router from './router';

import ElementUI from './element-ui/index';
import XForm from '../src/index';
import XFormElementUI from '../packages/element-ui';

import Modal from './components/Modal.vue'
import App from './App.vue';

XForm.use(XFormElementUI);
Vue.component(Modal.name, Modal);

Vue.use(ElementUI, {size: 'small'});
Vue.use(XForm, {
  modes: {
    example: [
      {
        group: '基础字段',
        types: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date']
      },
      {
        group: '辅助字段',
        types: ['divider', 'info']
      }
    ],
    simple: ['text', 'textarea', 'number', 'select']
  },
  validator: {
    immediate: true
  }
});

const app = new Vue({
  router,
  provide: {
    fieldKey: '__x_form_field_key__',
    modelKey: '__x_form_model_key__'
  },
  render(h){
    return h(App);
  }
});

app.$mount('#app');