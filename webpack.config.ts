/*Cypress requires this file to compile our component*/
import path from 'path';
import webpack from 'webpack';
export default {
  mode: 'development',
  cache: true,
  target: 'web',
  //change devTool from cheap-module-source-map to eval-source-map for faster rebuild as recommended by WebPack
  devtool: 'cheap-module-source-map',
  entry: {
    [`app_v1.0.0`]: ['webpack-hot-middleware/client', 'core-js/stable', './src/js/app.ts'],
  },
  devServer: {
    static: __dirname + '/dist/',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
    // make webpack log less info during development to imporve performance
    // https://webpack.js.org/guides/build-performance/#output-without-path-info
    pathinfo: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      __development__: true,
    }),
    //The purpose of this plugin is to increase webpack speed by moving the type-checking logic to a separate process.
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
    // new ForkTsCheckerWebpackPlugin(),
    /*Starting from webpack 5, webpack would stop polyfill fill node library by default.
    As a result, statement like `require("url")` stops working.
    We need to explicitly polyfill them now.
    * */
    // new NodePolyfillPlugin(),
    //https://webpack.js.org/guides/build-performance/#dlls
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(`./vendors/vendor_v3-manifest.json`),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  /*Should Minimize the number of items in resolve.modules, resolve.extensions, resolve.mainFiles,
  resolve.descriptionFiles, as they increase the number of filesystem calls.
  https://webpack.js.org/guides/build-performance/#resolving*/
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    modules: ['node_modules', 'src/js', 'cypress'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src/js'), //this is recommended by webpack to improve performance https://webpack.js.org/guides/build-performance/#loaders
        exclude: /node_modules/,
        options: {
          //https://webpack.js.org/guides/build-performance/#typescript-loader
          transpileOnly: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'cypress'), //this is recommended by webpack to improve performance https://webpack.js.org/guides/build-performance/#loaders
        exclude: /node_modules/,
        options: {
          //https://webpack.js.org/guides/build-performance/#typescript-loader
          transpileOnly: true,
        },
      },
    ],
    exprContextCritical: false,
  },
};
