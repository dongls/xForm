const presets = [
  ['@babel/preset-env', {
    useBuiltIns: 'usage',
    corejs: 3
  }]
];

const plugins = [
  '@babel/plugin-syntax-jsx',
  '@ant-design-vue/babel-plugin-jsx'
]

module.exports = { presets, plugins };