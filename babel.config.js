const presets = [
  ['@babel/preset-env', {
    useBuiltIns: 'usage',
    corejs: 3
  }]
];

const plugins = [
  '@vue/babel-plugin-jsx'
]

module.exports = { presets, plugins };