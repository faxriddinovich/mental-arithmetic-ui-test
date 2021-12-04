module.exports = {
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess(config) {
        config.plugins.delete("pwa");
      },
      nodeIntegration: true,
    },
  },
  devServer: {
    disableHostCheck: true,
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    if (process.env.NODE_ENV === "development") {
      config.output.filename("[name].[hash].js").end();
    }

    /*
    config.plugins.delete('ts-loader');
    config.plugins.delete('fork-ts-checker');
    config.plugins.delete('ts');
    */

    config.module
      .rule("preprocessor")
      .test(/\.(ts|vue)$/)
      .use("webpack-preprocessor-loader")
      .loader("webpack-preprocessor-loader")
      .options({
        params: {
          __DESKTOP__: !!process.env.DESKTOP,
          __MOBILE__: !!process.env.MOBILE,
          __BROWSER__: !!process.env.BROWSER,
        },
        verbose: false,
      })
      .end()
      .rule("ts")
      .include.add(/vuex-composition-helpers/);
  },
};
