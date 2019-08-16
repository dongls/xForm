import {mixin} from '@src/index'
import icon from '../../common/svg/textarea.svg';

import setting from './setting.vue';
import builder from './builder.vue';
import viewer from './viewer.vue';

const MAX_LENGTH = 150;

export default {
  type: 'textarea',
  title: '多行文本',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    builder,
    viewer,
    preview: {
      name: 'xform-el-textarea-preview',
      mixins: [mixin.preview],
      render(){
        return <textarea rows="3" class="xform-el-mock" placeholder={this.prettyPlaceholder}/>
      }
    }
  },
  validator: {
    max: MAX_LENGTH
  }
}