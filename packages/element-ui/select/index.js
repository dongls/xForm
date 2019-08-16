import {mixin} from '@src/index';
import icon from '../../common/svg/select.svg';

import setting from './setting.vue';
import builder from './builder.vue';

export default {
  type: 'select',
  title: '下拉选择',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    builder,
    preview: {
      name: 'xform-el-select-preview',
      mixins: [mixin.preview],
      render(){
        return (
          <select class="xform-el-mock">
            <option disabled selected>{this.prettyPlaceholder}</option>
          </select>
        )
      }
    }
  },
  validator: {}
}