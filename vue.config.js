process.env.VUE_APP_VERSION = require('./package.json').version;
const title = 'Glory.report';

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = title;
      return args;
    });
  }
};
