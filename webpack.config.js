const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const port = 3000;

const devMode = process.env.NODE_ENV !== 'production';

const clientConfig = {
  entry: ['./src/index.tsx'],
  output: {
    filename: '[name].[contenthash].js',
    path: `${__dirname}/build`,
    publicPath: '/',
  },
  target: 'web',
  mode: 'development',
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
    hot: true,
  },
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
  ],
};

module.exports = clientConfig;
