function createLabel(){
  return {
    // left, right, top,
    position: 'left', 
    width: null
  }
}

function createIcons(){
  return {
    designerRemove: '',
    designerCopy: '',
    builderHelp: ''
  }
}

export default {
  icons: createIcons(),
  modes: {},
  label: createLabel(),
  designer: {
    label: createLabel()
  },
  builder: {
    label: createLabel()
  },
  viewer: {
    label: createLabel()
  },
  validator: {
    // 实时验证
    immediate: true
  },
  formatter(field, model){
    return model[field.name]
  }
};