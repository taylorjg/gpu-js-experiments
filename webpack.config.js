/* eslint-env node */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')

const path = require('path')
const { version } = require('./package.json')

const SERVER_PUBLIC = path.join(__dirname, 'server', 'public')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: SERVER_PUBLIC,
    filename: 'bundle.js',
    globalObject: '(typeof self != \'undefined\' ? self : this)'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      version
    }),
    new WorkerPlugin()
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: SERVER_PUBLIC
  }
}
