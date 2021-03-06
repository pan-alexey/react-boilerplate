'use strict';

const paths = require('../utils/paths');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssLoader = require('./helpers/cssLoader');

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry: [paths.resolve('./src/index.tsx')],
  devtool: 'source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom', // patch for real react hot module
      '~': paths.root,
      '~src': paths.src,
      '~server': paths.server,
    },
    extensions: ['.scss', '.js', 'jsx', '.ts', '.tsx'],
  },
  output: {
    path: paths.dist,
    filename: 'index.js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    // publicPath: 'https://react.vxv.me/', for cdn chucnk
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 40,
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', { loader: 'ts-loader', options: { onlyCompileBundledFiles: true } }],
      },
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          cssLoader(false),
          'sass-loader',
        ],
      },
    ],
  },
};

module.exports = module.exports = (config) => {
  return webpack(Object.assign(webpackConfig, config || {}));
};
