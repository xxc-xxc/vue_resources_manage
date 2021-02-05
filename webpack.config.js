// const path = require('path') // 导入 node.js 中专门操作路径的模块
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const htmlPlugin = new HtmlWebpackPlugin({
//     template: "./src/index.html",
//     filename: "index.html"
// });
// const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: "development", //可以设置为development(开发模式)，production(发布模式)
    // entry: path.join(__dirname, './src/index.js'), // 打包入口文件的路径
    // output: {
    //     path: path.join(__dirname, './dist'), // 输出文件的存放路径
    //     filename: 'bundle.js' // 输出文件的名称
    // },
    // plugins: [
    //     htmlPlugin,// plugins 数组是 webpack 打包期间会用到的一些插件列表
    //     new VueLoaderPlugin()
    // ], 
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
            // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
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