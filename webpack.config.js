process.env['NODE_ENV'] = process.argv.indexOf('--prod') !== -1
  ? 'production'
  : '';

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          ident: 'postcss'
        }
      }
    ]
  }
};
