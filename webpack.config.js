var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
/* 
//extracting CSS to Gulp task for better performance
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename : "[name].css"
    //filename: "[name].[contenthash].css",
    //disable: process.env.NODE_ENV === "development"
});
*/

module.exports = {
  entry: {
    app: './src/app.js',
    //styles: './src/sass/app.scss' //extracting CSS to Gulp task for better performance
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets/'),
    publicPath: '/ui-prototype/dist/assets/',
    filename: '[name].js'
  },
  module: {
    rules: [
      /*
      //extracting CSS to Gulp task for better performance
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "sass-loader"
          ]
        })
      },*/
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: true
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },/*
  plugins: [
    new UglifyJsPlugin()
  ]*/
  /*
  //extracting CSS to Gulp task for better performance
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ],*/
  devtool: '#eval-source-map' //disable for prod
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
