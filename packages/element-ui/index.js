import Text from './text';
import Textarea from './textarea';
import Number from './number';
import Select from './select';
import Checkbox from './checkbox';
import Radio from './radio';
import Date from './date';
import Divider from './divider';
import Info from './info';

export default {
  types: {
    [Text.type]: Text, 
    [Textarea.type]: Textarea, 
    [Number.type]: Number, 
    [Select.type]: Select, 
    [Checkbox.type]: Checkbox, 
    [Radio.type]: Radio, 
    [Date.type]: Date,
    [Divider.type]: Divider,
    [Info.type]: Info
  },
  config: {
    icons: {
      designerRemove: 'el-icon-close',
      designerCopy: 'el-icon-copy-document',
      builderHelp: 'el-icon-info'
    }
  }
}