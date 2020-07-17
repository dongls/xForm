# 快速上手

本节将介绍如何在项目中使用xForm。
::: tip 提示
该文档默认你使用[Webpack][webpack]构建项目，代码使用ES2015+规范进行编写。
:::

## 安装
推荐使用`npm`的方式安装，它能更好地和[Webpack][webpack]配合使用。
```sh
npm install @dongls/xform

# 安装基于bootstrap的字段库
npm i @dongls/xform.bootstrap
```
当然你也通过CDN获取到最新版本的资源，例如你可以直接引用[unpkg][unpkg]提供的在线资源。 
```html
<!-- 核心组件 -->
<link href="https://unpkg.com/@dongls/xform@__VERSION__/dist/index.css" rel="stylesheet">
<script src="https://unpkg.com/@dongls/xform@__VERSION__/dist/index.js"></script>

<!-- 基于bootstrap的字段库 -->
<link href="https://unpkg.com/@dongls/xform.bootstrap@__VERSION__/dist/index.js" rel="stylesheet">
<script src="https://unpkg.com/@dongls/xform.bootstrap@__VERSION__/dist/index.css"></script>
```

## 使用
`xForm`本身并**不提供具体字段类型的实现**，因此在设计时就将核心组件与字段解耦，所以你可以选择只使用核心组件，也可以选择使用内置字段（依赖外部UI库）。

#### 只使用核心组件
如果您不需要任何内置的字段类型，您可以选择只引入核心组件。如果您选择了此种方式，那么您需要提供字段类型的具体实现。
```javascript
import { createApp } from 'vue';
import App from 'somepath'

import '@dongls/xform/dist/index.css';
import XForm from '@dongls/xform';

import Text from 'somepath';
import Select from 'somepath';

// 注册扩展字段
XForm.store.registerField(Text);
XForm.store.registerField(Select);

createApp(App).use(XForm, { 
  config: { /* xForm config */ } 
});
```

#### 使用基于Bootstrap的字段库
字段库基于[Bootstrap@4.x][bootstrap]开发，你需要自行安装`Bootstrap`。

```javascript
import '@dongls/xform/dist/index.css';
import '@dongls/xform.bootstrap/dist/index.css';

import { createApp } from 'vue'
import App from 'somepath'

import XForm from '@dongls/xform';
import XFormBootstrap from '@dongls/xform.bootstrap';

createApp(App).use(XForm, {
  preset: XFormBootstrap,
  config: { /* xForm config */ } 
});

```

<!-- ## Hello world
这里有一个基于`Bootstrap`的在线示例。
<iframe height="265" style="width: 100%;" scrolling="no" title="Element demo" src="//codepen.io/ziyoung/embed/rRKYpd/?height=265&theme-id=light&default-tab=html" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/ziyoung/pen/rRKYpd/'>Element demo</a> by hetech
  (<a href='https://codepen.io/ziyoung'>@ziyoung</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe> -->

[Webpack]: https://webpack.js.org
[unpkg]: https://unpkg.com/@dongls/xform/
[bootstrap]: https://getbootstrap.com/docs/4.5/