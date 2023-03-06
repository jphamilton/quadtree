module.exports = {  
  entry: './src/quadtree.ts',
  mode: 'production',
  output: {
    filename: './quadtree.js',
    libraryTarget: 'var',
    library: 'Quadtree'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
      }
    ]
  }
}