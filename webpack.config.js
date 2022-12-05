const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/RangeSlider.ts',
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
    publicPath: 'auto',
    filename: 'RangeSlider.js',
    path: path.resolve(__dirname, 'public'),
  },
};