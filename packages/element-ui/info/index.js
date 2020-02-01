import {mixin, model} from '@dongls/xform';
import icon from '../../common/svg/info.svg';
import setting from './setting.vue';

export default {
  type: 'info',
  title: '说明文字',
  icon(h){
    return <img class="xform-icon" src={icon}/>
  },
  component: {
    setting,
    preview: {
      name: 'xform-el-info-preview',
      mixins: [mixin.preview],
      render(){
        return <div class="xform-el-info-preview">{this.field.attributes.content}</div>
      }
    },
    builder: {
      name: 'xform-el-info',
      mixins: [mixin.builder],
      data(){
        return {
          showToggleBtn: false,
          collapse: false
        }
      },
      methods: {
        toggle(){
          this.collapse = !this.collapse;
        }
      },
      render(){
        const className = {
          'xform-el-info': true,
          'xform-el-info-collapse': this.collapse
        }

        return (
          <div class={className}>
            <div class="xform-el-info-content">{this.field.attributes.content}</div>
            { this.showToggleBtn && <div class="xform-el-info-toolbar">
              <button type="button" onClick={this.toggle}>{this.collapse ? '查看详情' : '收起文字'}</button>
            </div> }
          </div>
        )
      },
      mounted(){
        if(this.$el.offsetHeight > 104){
          this.showToggleBtn = true;
        }
      }
    },
    viewer: {
      name: 'xform-el-info-viewer',
      props: {
        field: {
          type: model.XField,
          default: null
        }
      },
      render(){
        const content = this.field.attributes.content;
        return content && <div class="xform-el-info-viewer">{content}</div>;
      }
    }
  },
  attributes(){
    return {
      viewer: false,
      content: null
    }
  }
}