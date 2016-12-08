var webpack = require('webpack');

module.exports = {  
  entry: './src/quadtree.ts',
  output: {
    filename: './build/quadtree.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
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