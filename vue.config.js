const path = require('path');

module.exports = {
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess(config) {
        config.plugins.delete("pwa");
      },
      nodeIntegration: true,
    },
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    config.plugins.delete('fork-ts-checker');
    if (process.env.NODE_ENV === "development") {
      config.output.filename("[name].[hash].js").end();
    }

    config.resolve.alias
      .set('@@', path.resolve(__dirname, 'public'));
  },
};
