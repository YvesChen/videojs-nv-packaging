const path = require('path'),
    webpack = require('webpack'),
    CompressionPlugin = require("compression-webpack-plugin"),
    isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    publicPath: '/',
    filenameHashing: true,
    productionSourceMap: process.env.NODE_ENV !== 'production',
    devServer: {
        port: 8077
    },
    // 扩展 webpack 配置
    chainWebpack: (config) => {
        // @ 默认指向 src 目录，这里要改成 examples
        // 另外也可以新增一个 ~ 指向 packages
        config.resolve.alias
            .set('@', path.resolve('src'))
            .set('~', path.resolve('packages'))
        // 把 packages 和 examples 加入编译，因为新增的文件默认是不被 webpack 处理的
        config.module
            .rule('js')
            .include.add(/packages/)
            .end()
            .include.add(/src/)
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                // 修改它的选项...
                return options
            });
    },
    configureWebpack: config => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery',
                'vuex': 'Vuex'
            })
        );
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
    },
    // 修改 pages 入口
    pages: {
        index: {
            entry: 'src/main.js', // 入口
            template: 'public/index.html', // 模板
            filename: 'index.html' // 输出文件
        }
    },
}
