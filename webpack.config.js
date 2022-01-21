const path = require('path');

module.exports = {
  mode: 'development',
  entry: './RangeSlider.ts',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, '')],
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', 'text/html'],
  },
  devtool: 'eval-source-map',
  output: {
    publicPath: 'public',
    filename: 'RangeSlider.js',
    path: path.resolve(__dirname, 'public'),
  },
};