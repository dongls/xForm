import {mixin} from '@src/index'
import icon from '../../common/svg/date.svg';

import setting from './setting.vue';
import builder from './builder.vue';

const DATE_REG = /^\d{4}-\d{1,2}-\d{1,2}$/;
const DATETIME_REG = /^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}:\d{2}$/;

export default {
  type: 'date',
  title: '日期',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    builder,
    preview: {
      name: 'xform-el-date-preview',
      mixins: [mixin.preview],
      render(){
        return (
          <div class="xform-el-input-group">
            <input type="text" class="xform-el-mock" placeholder={this.prettyPlaceholder}/>
            <div class="xform-el-input-append">
              <i class="iconfont icon-xform-date"></i>
            </div>
          </div>
        )
      }
    }
  },
  validator: {
    test(value, field){
      const reg = field.attributes.type == 'date' ? DATE_REG : DATETIME_REG;
      return reg.test(value) ? null : '格式有误，请重新选择';
    }
  }
}