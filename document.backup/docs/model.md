## XField
`XField`主要用于描述字段数据，保存用户对字段的配置。从数据库中取出的数据需要转成该类型才可被组件接受。
```typescript
interface XField{
  type: string; // 字段类型
  name: string; // 字段名，建议唯一
  title?: string; // 字段标题
  placeholder?: string; // 是否必填
  required?: boolean; // 选项
  options?: any[];
  
  attributes?: { // 自定义属性，可自行添加所需属性
    [prop: string]: any;
    remove?: boolean; // 是否允许字段被删除
  };  
  
  // 字段缓存，不可枚举
  storage: {
    fieldConf: XFieldConf;
  }

  // 查询字段对应的字段配置
  findFieldConf(): XFieldConf | null;
  // 复制该字段，name属性除外
  copy(): XField;
}
```

## XFieldConf
`XFieldConf`主要用于描述字段类型的配置，例如字段该如何渲染、验证等。`Ref`和`ComponentOptions`都是由`Vue`提供的类型。
```typescript
type ModeCompontFunc = (field: XField, mode: string) => ComponentOptions | VNode;
type XFieldConfComponent = ComponentOptions | ModeCompontFunc;

interface XFieldConf {
  type: string; // 字段类型
  title: string; // 字段名
  icon?: string | Function; // 字段icon
  custom?: boolean;
  attributes?: object | Function;
  extension?: object;

  setting?: XFieldConfComponent;
  preview?: XFieldConfComponent;
  build?: XFieldConfComponent;
  view?: XFieldConfComponent

  // 字段验证器
  validator?: (
    field: XField, 
    value: any, 
    model: any, 
    context: { validating: Ref<Boolean>, message: Ref<string>}
  ) => Promise;
}
```

## XFormSchema
`XFormSchema`主要用于描述表单配置数据。数据来源于表单设计器，可序列化后存入数据库。`xForm`就是依据它渲染表单。
```typescript
interface XFormSchema {
  [propName: string]: any;
  fields: XField[];
  labelSuffix?: string;
  labelPosition?: string;
  viewerPlaceholder?: string;
}
```