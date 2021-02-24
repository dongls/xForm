const presets = [
  ['@babel/preset-env', {
    useBuiltIns: 'usage',
    corejs: 3,
    // debug: true
  }]
];

const plugins = [
  '@vue/babel-plugin-jsx'
]

module.exports = { presets, plugins };