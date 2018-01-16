const webpack = require('webpack');
const path = require('path');

const PATHS = {
  src: path.join(__dirname, '/src/'),
  dist: path.join(__dirname, '/dist/')
}

module.exports = {
  devServer: {
    contentBase: PATHS.src,
    hot: true,
    inline: true
  },

  entry: [
    path.join(PATHS.src, 'app.js')
  ],

  output: {
    filename: 'bundle.js',
    path: path.dist,
    publicPath: 'build/'
  },

  module: {
    loaders : [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['env']
        }
      },
      {
        test:    /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['react']
        }
      },
      {
        test: /\.sass$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
