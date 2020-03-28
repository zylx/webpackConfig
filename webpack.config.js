const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 开发模式，webpack会根据该模式使用相应的编译配置
    mode: 'development',
    // 打包入口
    entry: './src/main.js',
    // 打包后资源输出路径
    output: {
        filename: './bundle.js',
        path: resolve(__dirname, './build')
    },
    // 依赖模块，通过设置对应loader去执行一些webpack理解不了的语法资源
    // 如jsx转化为js，less转化为css等，相当于翻译官
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            // {
                            //     //按需加载
                            //     useBuiltIns: 'usage',
                            //     //指定core-js版本
                            //     corejs: {
                            //         version: 3
                            //     },
                            //     //指定到最低浏览器版本的兼容性
                            //     targets: {
                            //         chrome: '60',
                            //         firefox: '60',
                            //         ie: '9',
                            //         safari: '10',
                            //         edge: '17'
                            //     }
                            // }
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', {
                                'legacy': true
                            }], //将es6+中更高级的特性转化---装饰器
                            ['@babel/plugin-proposal-class-properties', {
                                'loose': true
                            }], //将es6中更高级的API进行转化---类
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }]
            },
            {
                test: /\.less/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')({
                                    //必须设置支持的浏览器才会自动添加添加浏览器兼容
                                    overrideBrowserslist: [
                                        "last 2 versions",
                                        "> 1%"
                                    ]
                                })
                            ]
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.(jpg|jepg|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 当图片大于8k时，交给file-loader处理，否则url-loader会把图片src转成base64编码
                        limit: 1024 * 8,
                        name: '[name].[hash:10].[ext]',
                        outputPath: 'images',
                        esModule: false // 新版file-loader使用了ES Module模块化方式，将esModule配置为false就可以解决html页面中图片解析地址不正确问题
                    }
                }]
            },
            {
                //字体解析
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(html|htm)$/,
                use: [{
                    loader: 'html-withimg-loader',
                    options: {
                        outputPath: 'images'
                    }
                }]
            },
            {
                test: /\.vue$/,
                use: [{
                        loader: 'cache-loader' // 缓存loader编译的结果
                    },
                    {
                        loader: 'thread-loader' // 作用使用 worker 池来运行loader，每个 worker 都是一个 node.js 进程
                    },
                    {
                        loader: 'vue-loader', // 解析.vue文件
                        options: {
                            compilerOptions: { // 编译模板
                                preserveWhitespace: false
                            }
                        }
                    }
                ]
            }
        ]
    },
    // 依赖插件，处理一些打包压缩、资源优化等任务，比loader功能更强大
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, './src/index.html')
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin()
    ],
    devServer: {
        contentBase: resolve(__dirname, './build'),
        compress: true,
        open: true,
        hot: true,
        port: 8000
    }
}