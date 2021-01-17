module.exports = {
  configureWebpack: {
    node: {
      __dirname: false
    },
  },
  chainWebpack: config => {
    config.externals = {
      "@google-cloud": "@google-cloud",
      "@google-cloud/speech": "@google-cloud/speech",
      "@google-cloud/translate": "@google-cloud/translate"
    }
  },
  // //   config.module
  // //     .rule("relocator")
  // //     .test(/\.(m?js|node)$/)
  // //     .use("@vercel/webpack-asset-relocator-loader")
  // //     .loader("@vercel/webpack-asset-relocator-loader")
  // //     .options({
  // //       // optional, base folder for asset emission (eg assets/name.ext)
  // //       outputAssetBase: "assets",
  // //       //filterAssetBase: "node_modules",
  // //       // optional, permit entire __dirname emission
  // //       // eg `const nonAnalyzable = __dirname` can emit everything in the folder
  // //       emitDirnameAll: true,
  // //       // optional, permit entire filterAssetBase emission
  // //       // eg `const nonAnalyzable = process.cwd()` can emit everything in the cwd()
  // //       emitFilterAssetBaseAll: false,
  // //       cwd: process.cwd(), // optional, default
  // //       debugLog: true // optional, default
  // //     })
  // //     .end();
  // //
  // //     config.module
  // //         .rule("htmlyeeter")
  // //         .test(/\.html$/)
  // //         .use("html-loader")
  // //         .loader("html-loader")
  // //         .end();
  // // },
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
};
