var webpack = require('webpack');

module.exports = {  
  entry: './src/example.ts',
  output: {
    filename: './example/example.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' }
    ]
  }
}