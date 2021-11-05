const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const port = 3000;

const dotenv = require('dotenv');
dotenv.config();

const config = require('./config');

const devMode = process.env.NODE_ENV !== 'production';

const optimizationOptions = {
  minimize: true,
    minimizer: [new TerserPlugin({})],
};

const clientConfig = {
  entry: ['./src/index.tsx'],
  output: {
    filename: '[name].[contenthash].js',
    path: `${__dirname}/build`,
    publicPath: '/',
  },
  target: 'web',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /globalWithModules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: {
                    localIdentName: '[local]',
                    context: path.resolve(__dirname, 'src'),
                  },
                },
              },
              'postcss-loader',
            ],
          },
          {
            resourceQuery: /global/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
            ],
          },
          {
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: {
                    localIdentName: '[name]__[local]_[hash]',
                  },
                  url: false,
                },
              },
              'postcss-loader',
            ],
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ],
        include: [
          path.resolve('./src'),
        ],
      },
      {
        test: /\.m?(ts|js)x?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
  },
  devServer: {
    port,
    historyApiFallback: true,
    hot: true
  },
  optimization: devMode ? undefined : optimizationOptions,
  plugins: [
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: devMode ? "css/[name].css" : "css/[name].[contenthash].css",
      chunkFilename: devMode ? "css/[id].css" : "css/[id].[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/',
          to: 'assets/',
        },
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          API_URL: JSON.stringify(config.ApiUrl),
        },
      },
    })
  ],
};

module.exports = clientConfig;
