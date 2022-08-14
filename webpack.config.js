const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = (env, arg) => {
  const { mode } = arg

  const isProduction = mode === 'production'
  const filename = isProduction ? '[name].[contenthash]' : '[name]'

  return {
    entry: {
      server: './src/server.js',
      main: './src/client.js'
    },

    devtool: 'source-map',

    target: 'node',

    node: {
      __dirname: false,
      __filename: false
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          type: 'asset/resource'
        },
        {
          test: /\.(s*)css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        inject: 'body',
        template: './public/index.html',
        filename: path.resolve(__dirname, './build/public/index.html'),
        excludeChunks: ['server'],
        minify: isProduction
      }),

      new MiniCssExtractPlugin({
        filename: `${filename}.css`
      }),

      new ESLintPlugin({
        extensions: ['js', 'jsx', 'json'],
        fix: false,
        emitError: true,
        emitWarning: true,
        failOnError: true
      }),

      new StylelintPlugin({
        extensions: ['scss', 'css'],
        fix: false,
        emitError: true,
        emitWarning: true,
        failOnError: true
      })
    ],

    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    },

    output: {
      path: path.resolve(__dirname, 'build'),
      clean: true,
      filename: ({ chunk }) => {
        if (chunk.name === 'server') return '[name].js'

        return `${filename}.js`
      }
    },

    optimization: {
      minimize: isProduction
    }
  }
}
