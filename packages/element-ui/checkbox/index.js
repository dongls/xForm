import icon from '../../common/svg/checkbox.svg';

import setting from './setting.vue';
import builder from './builder.vue';
import preview from './preview.vue';

/**
 * TODO:
 * 1. 支持全选
 */
export default {
  type: 'checkbox',
  title: '复选框',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    builder,
    preview
  },
  validator: {
    message: '至少选择一项'
  }
}