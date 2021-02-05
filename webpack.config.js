module.exports = {
  mode: 'development',
  module: {
    rules: [
      // { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }
      // { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      // {
      //     test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2|jpeg$/,
      //     use: 'url-loader?limit=16940'
      // },
      // { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      // { test: /\.vue$/, loader: 'vue-loader' }
    ]
  }
}
