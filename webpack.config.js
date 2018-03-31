/* eslint-env node */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const serverPublic = path.join(__dirname, 'server', 'public');

module.exports = {
    entry: [
        'babel-polyfill',
        './client/index.js'
    ],
    output: {
        path: serverPublic,
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: serverPublic
    }
};