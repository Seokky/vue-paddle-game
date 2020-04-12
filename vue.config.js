module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-paddle-game/'
    : '/',
  outputDir: 'docs',
  productionSourceMap: false,
  devServer: {
    overlay: false,
  },
};
