"use strict";(self.webpackChunkxform=self.webpackChunkxform||[]).push([[55],{2055:(o,e,t)=>{t.r(e),t.d(e,{default:()=>r});var s=t(7091),c=t.n(s),i=new URL(t(7247),t.b);const r='<section> <md-meta toc="false"></md-meta> <h1>介绍</h1> <p><strong>基于<a href="https://github.com/vuejs/vue-next">Vue@3.x</a>的动态表单生成器</strong>，主要用于处理用户自行设计表单的业务场景。这里提供了一个<a href="https://dongls.github.io/xForm/example.html">在线示例</a>更直观的展示该项目，或者可以查看<a href="/doc/quickstart">快速上手</a>了解如何使用。</p> </section> <section> <h2 class="head-anchor article-sticky-heading" id="特性">特性 ✨</h2> <ul class="doc-ul"> <li><strong>可扩展</strong> - 提供完善的字段扩展机制，可自行扩展字段</li> <li><strong>可定制</strong> - 提供多样化的配置，让开发人员完全控制表单的行为</li> <li>包含<strong>表单设计</strong>、<strong>表单生成</strong>、<strong>表单展示</strong>在内的组件库</li> <li>可与任何UI库集成，目前已集成<code>Bootstrap</code></li> <li>基于<code>typescript</code>和<code>Vue@3.x</code>开发</li> </ul> </section> <section> <h2 class="head-anchor article-sticky-heading" id="架构">架构</h2> <p><img src="'+c()(i)+'" alt="架构图"> xForm不提供具体的字段实现，专注于提供灵活的字段扩展机制。通过将底层核心与字段的解耦，具体字段实现可以基于任意UI库，只需要满足xForm的规则即可。</p> <p>考虑到xForm提供的功能与实际需求可能存在不相匹配的情况，因此在设计时就将<strong>可扩展性</strong>作为首要因素。为了使用户可以完全的控制表单的行为，xForm支持以下几种层级的配置：</p> <ul class="doc-ul"> <li>全局配置(<code>config</code>) - 表单的默认行为</li> <li>字段配置(<code>XField</code>) - 用户控制的行为</li> <li>字段类型配置(<code>XFieldConf</code>) - 字段类型的行为</li> <li>组件配置(<code>slot</code>) - 具体组件下的行为</li> </ul> <p>通常情况下用户并不懂技术，所以xForm让开发人员通过一系列的配置控制表单行为，在屏蔽技术细节的基础上提供自定义能力供用户使用。</p> <p>简单的说，<strong>面向普通用户隐藏技术细节，面向开发人员提供完整的控制力。</strong></p> </section> '},7091:o=>{o.exports=function(o,e){return e||(e={}),o?(o=String(o.__esModule?o.default:o),e.hash&&(o+=e.hash),e.maybeNeedQuotes&&/[\t\n\f\r "'=<>`]/.test(o)?'"'.concat(o,'"'):o):o}},7247:(o,e,t)=>{o.exports=t.p+"04310071d34b402cd9ac.png"}}]);