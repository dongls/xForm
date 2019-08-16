import icon from '../../common/svg/radio.svg';

import setting from './setting.vue';
import builder from './builder.vue';
import preview from './preview.vue';

export default {
  type: 'radio',
  title: '单选框',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    builder,
    preview
  },
  validator: {}
}