const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './js/main.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/docs/',
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      'node_modules',
      'js',
      '.'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'template.ejs'
    }),
    new UglifyJSPlugin()
  ]
};
