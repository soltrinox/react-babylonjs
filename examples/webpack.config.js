const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
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
            hh: path.resolve(__dirname, '../src/hh.js'),
            hhh: path.resolve(__dirname, '../src/hhh.js'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'BabylonJS as React',
            inject: 'body',
        }),
    ],
};
