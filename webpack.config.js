const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: ['./dist', path.resolve(__dirname, 'public')],
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            hh: './hh.js',
            util: ['./utils.js', 'util'],
            DEBUG: ['./utils.js', 'DEBUG'],
            WRAPPER: ['./utils.js', 'WRAPPER'],
            c: ['./utils.js', 'c'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'BabylonJS as React',
            inject: 'body',
        }),
    ],
};
