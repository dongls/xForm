const presets = [
  ['@babel/preset-env', {
    useBuiltIns: 'usage',
    corejs: 3
  }]
];

const plugins = [
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  '@vue/babel-plugin-jsx'
]

module.exports = { presets, plugins };