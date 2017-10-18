const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'public'),
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
            'react-babylonjs-3d': path.resolve(__dirname, '../src'),
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        },
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors-static',
            filename: 'vendors-static.js',
            minChunks: ({ context }) => /\bnode_modules\b/.test(context),
        }),
        new webpack.ProvidePlugin({
            hhh: ['react-babylonjs-3d', 'hhh'],
            React: ['react'],
            babylonjs: path.resolve(__dirname, 'node_modules/babylonjs'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'BabylonJS as React',
            inject: 'body',
        }),
    ],
};
