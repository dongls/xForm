const RELEASE_TARGET = process.env.RELEASE_TARGET
const FOR_BUNDLER = RELEASE_TARGET === 'bundler'

const presets = [
  ['@babel/preset-env', {
    browserslistEnv: FOR_BUNDLER ? undefined : RELEASE_TARGET,
    useBuiltIns: FOR_BUNDLER ? false : 'usage',
    corejs: 3,
    // debug: true,
  }]
];

const plugins = [
  '@vue/babel-plugin-jsx'
]

module.exports = { presets, plugins };