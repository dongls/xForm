<script>
import {mixin} from '@dongls/xform';

export default {
  name: 'xform-el-checkbox-preview',
  mixins: [mixin.preview],
  render(){
    const field = this.field;
    const layout = field.attributes.layout || 'inline';
    const options = field.options.slice(0, 3);
    const value = options.length > 0 ? [options[0].value] : [];

    return (
      <el-checkbox-group class="xform-el-checkbox-preview" value={value}>
        {
          options.map(option => {
            if(layout == 'button') return (
              <el-checkbox-button label={option.value} key={option.value}>
                {option.label || option.value}
              </el-checkbox-button>
            );

            const className = [];
            if(layout == 'block'){
              className.push('xform-el-checkbox-preview-block');
            }

            return (
              <el-checkbox class={className} label={option.value} key={option.value}>
                {option.label || option.value}
              </el-checkbox>
            );
          })
        }
      </el-checkbox-group>
    )
  }
}
</script>