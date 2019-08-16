import icon from '../../common/svg/divider.svg';

import setting from './setting.vue';
import preview from './preview.vue';
import builder from './builder.vue';

export default {
  type: 'divider',
  title: '分割线',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  custom: true,
  component: {
    setting,
    preview,
    builder,
    viewer: builder
  },
  attributes(){
    return {
      layout: 'center',
      type: 'solid',
      top: 0,
      bottom: 0
    }
  }
}