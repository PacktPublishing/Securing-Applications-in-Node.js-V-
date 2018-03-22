module.exports = {
  mode: 'development',
  entry: {
    login: './src/client/login.js',
    register: './src/client/register.js',
    'password-reset': './src/client/password-reset.js',
    'change-password': './src/client/change-password.js',
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
