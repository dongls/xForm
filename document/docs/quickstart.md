# 快速上手

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
<link href="https://unpkg.com/@dongls/xform.bootstrap@__VERSION__/dist/index.css" rel="stylesheet">
<script src="https://unpkg.com/@dongls/xform.bootstrap@__VERSION__/dist/index.js"></script>
```

## 使用
`xForm`本身并**不提供具体字段类型的实现**，因此在设计时就将核心组件与字段解耦，所以你可以选择只使用核心组件，也可以选择使用内置字段（依赖外部UI库）。

### 只使用核心组件
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

### 使用基于Bootstrap的字段库
字段库基于[Bootstrap@4.x][bootstrap]开发，这里推荐安装`v4.5`及以上版本。

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
这里有一个基于Bootstrap的[在线表单设计器](https://codepen.io/dongls/pen/QWyJvEN)或者查看[在线示例][example]的[源代码][code]了解如何使用。
<iframe height="265" style="width: 100%;" scrolling="no" title="xform bootstrap demo" src="https://codepen.io/dongls/embed/QWyJvEN?height=265&theme-id=light&default-tab=html" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/dongls/pen/QWyJvEN'>xform bootstrap demo</a> by dongls
  (<a href='https://codepen.io/dongls'>@dongls</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

[Webpack]: https://webpack.js.org
[unpkg]: https://unpkg.com/@dongls/xform/
[bootstrap]: https://getbootstrap.com/docs/4.5/
[example]: https://dongls.github.io/xForm/example.html
[code]: https://github.com/dongls/xForm/tree/master/example