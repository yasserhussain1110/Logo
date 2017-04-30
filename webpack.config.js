const path = require('path');
const merge = require('webpack-merge');
const parts = require('./libs/parts');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
// Entry accepts a path or an object of entries.
// We'll be using the latter form given it's
// convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),

    new CopyWebpackPlugin([
      {
        from: './static',
        ignore: ['.*']
      }
    ])
  ]
};


let config;
// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      parts.setupCSS(PATHS.app),
      parts.setupBabel(),
      parts.setupUglify()
    );
    break;
  default:
    config = merge(
      common,
      parts.setupCSS(PATHS.app),
      parts.setupBabel()
    );
}
module.exports = config;
