const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// process.traceDeprecation = true;

module.exports = {
    entry: {
        main: [
            require.resolve('./polyfills'),
            'babel-runtime/regenerator',
            'babel-register',
            'webpack-hot-middleware/client?reload=true',
            './src/entry.js'
        ]
    },
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    },
    devServer: {
        contentBase: 'dist',
        hot: true,
        stats: {
            colors: true,
            errors: true,
            errorDetails: true,
            warnings: true,
            modules: false,
            hash: false,
            chunks: false,
            assets: false,
        }
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        alias: {
            Client: path.resolve(__dirname, '../src/Client/'),
            Server: path.resolve(__dirname, '../src/Server/'),
            App: path.resolve(__dirname, '../src/Client/App/'),
            Styles: path.resolve(__dirname, '../src/Client/Styles/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            eslintPath: require.resolve('eslint'),
                        },
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            highlightCode: true,
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.global\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                ]
            },
            {
                test: /\.css$/,
                exclude: /\.global\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]-[local]',
                            camelCase: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                ]
            },
            {
                test: /\.global\.(scss|sass)$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /\.global\.(scss|sass)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true,
                            localIdentName: '[name]-[local]',
                            camelCase: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src']
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HTMLWebpackPlugin({
            template: './src/Client/index.html',
            inject: true,
            title: 'React App'
        }),
    ],
    performance: { hints: false }
};
