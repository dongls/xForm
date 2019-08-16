process.env.NODE_ENV = 'production';

const webpack = require('webpack')
const config = require('../config/webpack.example.config');

const statsOptions = {
  colors: true,
  modules: false,
  children: false,
  entrypoints: false
}

webpack(config, function (err, stats) {
  if (err) return console.log(err);

  console.log(stats.toString(statsOptions))
});