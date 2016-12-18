var webpack = require('webpack');

module.exports = {  
  entry: './src/quadtree.ts',
  output: {
    filename: './dist/quadtree.js',
    libraryTarget: 'var',
    library: 'Quadtree'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' }
    ]
  }
}