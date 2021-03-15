const merge = require('webpack-merge');
const path = require('path');

const common = {
  context: __dirname,

  output: {
    path: path.resolve(__dirname, './dist'),
    library: 'OauthChrome',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}

const prod = {

  entry: {
    'extension-lib.min': './src/index.js'
  },

  mode: 'production',

  devtool: 'source-map'
}

const dev = {

  entry: {
    'extension-lib': './src/index.js'
  },

  mode: 'development',

  devtool: 'source-map'
}

module.exports = [ merge(common, prod), merge(common, dev) ];
