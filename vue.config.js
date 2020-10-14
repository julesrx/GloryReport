process.env.VUE_APP_VERSION = require('./package.json').version;

const appTitle = 'Glory.report';
const appDescription = 'Destiny 2 player encounters and PvP stats.';
const appUrl = 'https://glory.report/';

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = appTitle;
      args[0].description = appDescription;
      args[0].url = appUrl;
      return args;
    });
  },
  pwa: {
    name: appTitle,
    themeColor: '#121212',
    msTileColor: '#000000'
  }
};
