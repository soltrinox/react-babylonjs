const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        index: path.join(__dirname, "src", "index.js"),
    },
    mode: "development",
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "public"),
    },
    // devtool: 'cheap-source-map',
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        publicPath: "/",
        hot: true,
        headers: { "Access-Control-Allow-Origin": "*" },
        host: "0.0.0.0",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: "babel-loader",
            },
        ],
    },
    resolve: {
        alias: {
            "react-babylonjs-3d": path.resolve(__dirname, "../src"),
            react: path.resolve(__dirname, "node_modules/react"),
            "react-reconciler": path.resolve(
                __dirname,
                "node_modules/react-reconciler"
            ),
        },
    },
    optimization: {
        splitChunks: {},
    },
    optimization: {
        splitChunks: {
            // include all types of chunks
            chunks: "all",
        },
    },
    plugins: [
        // new webpack.optimization.splitChunks({
        //     name: "vendors-static",
        //     filename: "vendors-static.js",
        //     minChunks: ({ context }) => /\bnode_modules\b/.test(context),
        // }),
        new webpack.ProvidePlugin({
            React: ["react"],
            babylonjs: path.resolve(__dirname, "node_modules/babylonjs"),
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            title: "BabylonJS as React",
            inject: "body",
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
