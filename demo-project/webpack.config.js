module.exports = {
  mode: 'development',
  entry: {
    'password-reset': './src/client/password-reset.js',
  },
  output: {
    path: __dirname + '/public',
    filename: 'static/js/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}],
  },
};
