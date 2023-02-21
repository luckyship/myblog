// var webpack = require("webpack");
// var autoprefixer = require('autoprefixer');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var CleanPlugin = require('clean-webpack-plugin');

// // 模板压缩
// // 详见：https://github.com/kangax/html-minifier#options-quick-reference

// var minifyHTML = {
//   collapseInlineTagWhitespace: true,
//   collapseWhitespace: true,
//   minifyJS: true
// }

// let packName = '[name].[chunkhash:6]';
// let resourceName = '[name].[hash:6]';

// module.exports = {
//   entry: {
//     main: "./source-src/js/main.js",
//     slider: "./source-src/js/slider.js",
//     mobile: ["babel-polyfill", "./source-src/js/mobile.js"]
//   },
//   output: {
//     path: "./source",
//     publicPath: "./",
//     filename: `${packName}.js`
//   },
//   module: {
//     loaders: [{
//       test: /\.js$/,
//       loader: 'babel-loader?cacheDirectory',
//       exclude: /node_modules/
//     }, {
//       test: /\.html$/,
//       loader: 'html'
//     }, {
//       test: /\.(scss|sass|css)$/,
//       loader: ExtractTextPlugin.extract('style-loader', ['css-loader?-autoprefixer', 'postcss-loader', 'sass-loader'])
//     }, {
//       test: /\.(gif|jpg|png)\??.*$/,
//       loader: 'url-loader?limit=500&name=img/[name].[ext]'
//     }, {
//       test: /\.(woff|svg|eot|ttf)\??.*$/,
//       loader: "file-loader?name=fonts/[name].[hash:6].[ext]"
//     }]
//   },
//   alias: {
//     'vue$': 'vue/dist/vue.js'
//   },
//   resolve: {
//     alias: {
//       'vue$': 'vue/dist/vue.common.js'
//     }
//   },
//   // devtool: '#eval-source-map',
//   postcss: function() {
//     return [autoprefixer];
//   },
//   plugins: [
//     new ExtractTextPlugin(`${packName}.css`),
//     new webpack.DefinePlugin({
//       'process.env.NODE_ENV': '"production"'
//     }),
//     new HtmlWebpackPlugin({
//       inject: false,
//       cache: false,
//       minify: minifyHTML,
//       template: './source-src/script.ejs',
//       filename: '../layout/_partial/script.ejs'
//     }),
//     new HtmlWebpackPlugin({
//       inject: false,
//       cache: false,
//       minify: minifyHTML,
//       template: './source-src/css.ejs',
//       filename: '../layout/_partial/css.ejs'
//     })
//   ],
//   watch: process.env.NODE_ENV === 'production' ? false : true
// }

// module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new CleanPlugin('builds')
//   ])

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "production" ? false : true;

module.exports = {
  mode: isDev ? "development" : "production",
  // JavaScript 执行入口文件
  entry: {
    main: "./source-src/js/main.js",
    slider: "./source-src/js/slider.js",
    mobile: ["babel-polyfill", "./source-src/js/mobile.js"],
  },
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: "js/[name].[chunkhash:6].js",
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, "./source/main"),
    // 重定向根路径
    publicPath: "/main/",
    // 自动删除上次生成的打包文件
    clean: true,
  },
  watch: isDev ? true : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },

      /**
       * webpack5 内置file-loader
       * http://events.jianshu.io/p/558cd247822d
       */
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset",
        generator: {
          filename: "img/[name].[hash:6].[ext]",
          outputPath: "./",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 1024, // byte
          },
        },
      },
      {
        test: /\.(woff|svg|eot|ttf|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash:6].[ext]",
          outputPath: "./",
        },
      },

      // {
      //   test: /\.(png|jpg|gif)$/i,
      //   use: [
      //     {
      //       loader: "url-loader",
      //       options: {
      //         limit: 1024,
      //         name: "img/[name].[hash:6].[ext]",
      //         publicPath: "./",
      //         esModule: false, // 解决: 路径解析为 object%20Module https://blog.csdn.net/qian1314520hu/article/details/106217773
      //       },
      //     },
      //   ],
      //   type: "javascript/auto", // webpack5 https://webpack.js.org/guides/asset-modules/
      // },
      // {
      //   test: /\.(woff|svg|eot|ttf|woff2)$/i,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {
      //         name: "fonts/[name].[hash:6].[ext]",
      //         publicPath: "./",
      //         esModule: false, // 解决: 路径解析为 object%20Module https://blog.csdn.net/qian1314520hu/article/details/106217773
      //       },
      //     },
      //   ],
      //   type: "javascript/auto", // webpack5 https://webpack.js.org/guides/asset-modules/
      // },
    ],
  },
  // devtool: 'inline-source-map',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      cache: false,
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        minifyJS: true,
      },
      template: "./source-src/script.ejs",
      filename: "../../layout/_partial/script.ejs",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      cache: false,
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        minifyJS: true,
      },
      template: "./source-src/css.ejs",
      filename: "../../layout/_partial/css.ejs",
    }),
    // css从js分离，单独文件
    new MiniCssExtractPlugin({
      filename: "css/index.[chunkhash:6].css",
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true }, // 删除所有注释
            },
          ],
        },
      }),

      // 删除所有js注释，需设置mode: production才行
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: true,
        },
        extractComments: false,
      }),
    ],
  },
};
