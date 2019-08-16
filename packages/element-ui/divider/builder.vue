<script>
import divider from './divider.vue';

export default {
  name: 'xform-el-divider',
  props: {
    field: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  render(){
    const field = this.field;
    const {layout, type, top, bottom} = field.attributes;

    return <xform-divider class="xform-item" title={field.title} layout={layout} type={type} top={top} bottom={bottom}/>
  },
  components: {
    [divider.name]: divider
  }
}
</script>