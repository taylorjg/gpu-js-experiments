/* eslint-env node */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const SERVER_PUBLIC = path.join(__dirname, 'server', 'public')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: SERVER_PUBLIC,
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: SERVER_PUBLIC
  }
}
