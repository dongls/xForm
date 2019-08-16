import './element-variables.scss';

import Button from 'element-ui/lib/button';
import Input from 'element-ui/lib/input';
import InputNumber from 'element-ui/lib/input-number'
import Select from 'element-ui/lib/select';
import Option from 'element-ui/lib/option';
import Checkbox from 'element-ui/lib/checkbox';
import CheckboxButton from 'element-ui/lib/checkbox-button';
import CheckboxGroup from 'element-ui/lib/checkbox-group';
import Radio from 'element-ui/lib/radio';
import RadioButton from 'element-ui/lib/radio-button';
import RadioGroup from 'element-ui/lib/radio-group';
import DatePicker from 'element-ui/lib/date-picker';
import Tooltip from 'element-ui/lib/tooltip';
import Slider from 'element-ui/lib/slider';

const components = [
  Button,
  Input,
  InputNumber,
  Select,
  Option,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Radio,
  RadioButton,
  RadioGroup,
  DatePicker,
  Tooltip,
  Slider
];

export default {
  install(Vue, options){
    Vue.prototype.$ELEMENT = options;
    
    components.forEach(component => Vue.use(component))
  }
}