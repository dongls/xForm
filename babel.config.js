const RELEASE_TARGET = process.env.RELEASE_TARGET

const presets = [
  ['@babel/preset-env', {
    browserslistEnv: RELEASE_TARGET,
    useBuiltIns: 'usage',
    corejs: 3,
    // debug: true,
  }]
];

const plugins = [
  '@vue/babel-plugin-jsx'
]

module.exports = { presets, plugins };