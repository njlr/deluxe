const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const debug = process.env.NODE_ENV != 'production';

module.exports = {
  entry: [ '@babel/polyfill', './src/index.js' ],
  output: {
    path: path.resolve('dist'),
    filename: 'index.js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false })
  ],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true
            }
          },
          'eslint-loader',
        ],
      }
    ]
  },
  externals: [ nodeExternals() ]
};
