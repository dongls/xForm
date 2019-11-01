import {mixin} from '@src/index'
import icon from '../../common/svg/text.svg';

import setting from './setting.vue';
import builder from './builder.vue';

const MAX_LENGTH = 20;

export default {
  type: 'text',
  title: '单行文本',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    builder,
    preview: {
      name: 'xform-el-text-preview',
      mixins: [mixin.preview],
      render(){
        return <input type="text" class="xform-el-mock" placeholder={this.prettyPlaceholder}/>
      }
    }
  },
  validator: {
    max: MAX_LENGTH
  }
}