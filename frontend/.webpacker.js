  
const path = require('path');
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const {BaseHrefWebpackPlugin} = require('base-href-webpack-plugin');
const {setLoader, setPlugin} = require('webpacker/utils');
const env = `${process.env.NODE_ENV || 'development'}`;
const constants = require(`./config/${env}`);
const {isProduction, isDevelopment} = require('./config');
const scssVariables = path.resolve(__dirname, './src/scss/variables.scss');
const base = isProduction ? '/dist/' : '/';

const postcssOpts = postcssPresetEnv({
  browsers: ['last 2 versions', 'IE 10']
});

const port = 3000;
const host = '0.0.0.0';
const index = path.resolve(__dirname, './src/index.js');
module.exports = {
  devServer: fn => fn({port, host, hot: true}),
  entry: () => isProduction
    ? index
    : [
      index,
      'webpack/hot/dev-server',
      `webpack-dev-server/client?http://${host}:${port}/`,
    ],
  optimization: fn => fn({runtimeChunk: isProduction ? false : 'single'}),
  output: fn => fn({
    path: path.resolve(__dirname, './dist'),
    filename: 'app.bundle.js'
  }),
  preset: {
    loaders: [
      setLoader('react', {
        plugins: [
          ['@babel/transform-runtime', {regenerator: true}],
        ],
      }),
      setLoader('css'),
      setLoader('scss', {scssVariables, postcssOpts}),
    ],
    plugins: [
      setPlugin('configure', {constants}),
      setPlugin('css'),
      setPlugin('html', {index: path.join(__dirname, './src/index.html')}),
      setPlugin('compress', {threshold: 0}),
      () => new BaseHrefWebpackPlugin({baseHref: base}),
      () => new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      () => isDevelopment ? new webpack.SourceMapDevToolPlugin({}) : null,
      ({isDevServer}) => isDevServer && new webpack.HotModuleReplacementPlugin(),
    ],
  },
};