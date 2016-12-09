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
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin(
  //     {
  //       compress: { warnings: false }
  //     }
  //   )
  // ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' }
    ]
  }
}