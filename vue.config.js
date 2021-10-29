module.exports = {
  pluginOptions: {
    electronBuilder: {
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

    config.module
      .rule("preprocessor")
      .test(/\.vue$/)
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
      .end();
  },
};
