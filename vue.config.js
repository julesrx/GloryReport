const appTitle = 'Glory.report';
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = appTitle;
      return args;
    });
  },
  pwa: {
    name: appTitle,
    themeColor: '#121212',
    msTileColor: '#000000'
  }
};
