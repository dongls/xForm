const presets = [
  ['@babel/preset-env', {
    useBuiltIns: 'usage',
    corejs: 3
  }]
];

const plugins = [
  '@ant-design-vue/babel-plugin-jsx',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-syntax-jsx',
]

module.exports = { presets, plugins };