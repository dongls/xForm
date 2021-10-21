const RELEASE_TARGET = process.env.RELEASE_TARGET
const FOR_BUNDLER = RELEASE_TARGET === 'bundler'

const presets = (
  FOR_BUNDLER
    ? []
    : [
        ['@babel/preset-env',{
          browserslistEnv: RELEASE_TARGET,
          useBuiltIns: 'usage',
          corejs: 3,
        }]
      ]
)

const plugins = ['@vue/babel-plugin-jsx']

module.exports = { presets, plugins }