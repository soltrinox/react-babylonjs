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
    resolve: {
        alias: {
            'react-babylonjs-3d': path.resolve(__dirname, '../src/index.js'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            hhh: ['react-babylonjs-3d', 'hhh'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'BabylonJS as React',
            inject: 'body',
        }),
    ],
};
