
<script>
import {mixin} from '@src/index';

export default {
  name: 'xform-el-radio',
  mixins: [mixin.builder],
  props: {
    value: {
      type: String,
      default: null
    }
  },
  computed: {
    layout(){
      const field = this.field;
      return field.attributes.layout || 'inline';
    }
  },
  methods: {
    renderOption(option){
      if(this.layout == 'button') return <el-radio-button label={option.value} key={option.value}>{option.label || option.value}</el-radio-button>;

      const className = [];
      if(this.layout == 'block'){
        className.push('xform-el-radio-block');
      }

      return <el-radio class={className} label={option.value} key={option.value}>{option.label || option.value}</el-radio>
    }
  },
  render(){
    const options = this.field.options || [];
    const data = {
      'class': 'xform-el-radio',
      directives: [{
        name: 'xform',
        arg: 'validate',
        value: this.field.name
      }],
      on: {input: this.input},
      props: {value: this.value}
    }

    return (
      <el-radio-group {...data}>
        {options.map(this.renderOption)}
      </el-radio-group>
    )
  }
}
</script>