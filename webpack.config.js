const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '/app/src/'),
  dist: path.join(__dirname, '/app/build/')
}

module.exports = {

  watch: true,

  entry: [
    path.join(PATHS.src, 'entry.jsx')
  ],

  output: {
    path: PATHS.dist,
    publicPath: 'build/',
    filename: 'bundle.js'
  },

  module: {
    loaders : [
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   options: {
      //     presets: ['env']
      //   }
      // },
      {
        test:    /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['react']
        }
      },
      {
        test: /\.(sass|scss)$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader?indentedSyntax'
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    // new webpack.SourceMapDevToolPlugin()
    // new webpack.HotModuleReplacementPlugin()
  ]
}
