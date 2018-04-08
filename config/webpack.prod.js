const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

// process.traceDeprecation = true;

module.exports = (env) => {
    return {
        bail: true,
        mode: 'production',
        entry: {
            main: [
                require.resolve('./polyfills'),
                './src/index.js'
            ]
        },
        devtool: 'source-map',
        output: {
            filename: 'static/js/bundle-[hash:8].js',
            path: path.resolve(__dirname, '../dist'),
            publicPath: '/',
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        chunks: 'initial',
                        minChunks: 1
                    }
                }
            }
        },
        resolve: {
            alias: {
                Client: path.resolve(__dirname, '../src/Client/'),
                Server: path.resolve(__dirname, '../src/Server/'),
                App: path.resolve(__dirname, '../src/Client/App/'),
                Styles: path.resolve(__dirname, '../src/Client/Styles/'),
            }
        },
        module: {
            strictExportPresence: true,
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
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'babel-loader' }
                    ],
                },
                {
                    test: /\.global\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: {
                            loader: 'style-loader',
                            options: {
                                hmr: false,
                            },
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [autoprefixer]
                                }
                            }
                        ]
                    })
                },
                {
                    test: /\.css$/,
                    exclude: /\.global\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: {
                            loader: 'style-loader',
                            options: {
                                hmr: false,
                            },
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
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
                    })
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
                    use: ExtractTextPlugin.extract({
                        fallback: {
                            loader: 'style-loader',
                            options: {
                                hmr: false,
                            },
                        },
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
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
                    })
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
                                name: 'images/[name]-[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new OptimizeCssAssetsPlugin({
                assetNameRegEx: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true,
            }),
            new ExtractTextPlugin('static/css/[name]-[hash:8].css'),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new HTMLWebpackPlugin({
                template: './src/Client/index.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env.NODE_ENV)
                }
            }),
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    ecma: 8,
                    parallel: true,
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        comments: false,
                        ascii_only: true, // eslint-disable-line
                    },
                    compress: {
                        warnings: false,
                        comparisons: false,
                    },
                }

            }),
            new CompressionPlugin({
                algorithm: 'gzip'
            }),
            new BrotliPlugin(),
        ]
    };
};
