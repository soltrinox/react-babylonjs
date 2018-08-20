const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const _configKey = process.env.CONFIG_KEY || "dev";

const opts = {
    dev: {
        externals: {},
        devServer: {
            hot: true,
        },
        plugins: [
            new webpack.ProvidePlugin({
                React: ["react"],
                babylonjs: path.resolve(__dirname, "node_modules/babylonjs"),
            }),
            new HtmlWebpackPlugin({
                template: "./index.html",
                title: "BabylonJS as React",
                inject: "body",
                minify: false,
                scripts: "",
            }),
        ],
    },
    nonDev: {
        externals: {
            babylonjs: "BABYLON",
            react: "React",
            "react-dom": "ReactDOM",
        },
        devServer: {},
        plugins: [
            new HtmlWebpackPlugin({
                template: "./index.html",
                title: "BabylonJS as React",
                inject: "body",
                minify: true,
                scripts: [
                    '<script src="https://cdnjs.cloudflare.com/ajax/libs/babylonjs/3.3.0-beta.2/babylon.worker.js"></script>',
                    '<script crossorigin src="https://unpkg.com/react@16.4.2/umd/react.production.min.js"></script>',
                    '<script crossorigin src="https://unpkg.com/react-dom@16.4.2/umd/react-dom.production.min.js"></script>',
                ].join("\n"),
            }),
        ],
    },
};
const config = opts[_configKey];

module.exports = {
    entry: {
        index: path.join(__dirname, "src", "index.js"),
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "public"),
    },
    devServer: Object.assign(
        {
            contentBase: path.resolve(__dirname, "public"),
            publicPath: "/",
            port: "8091",
            headers: { "Access-Control-Allow-Origin": "*" },
            host: "0.0.0.0",
            before: function(app) {
                app.use("*", function(req, res, next) {
                    console.log(`${req.headers.referer} ${req.originalUrl}`);
                    next();
                });
            },
        },
        config.devServer
    ),
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
            chunks: "all",
        },
    },
    externals: config.externals,
    plugins: [
        ...config.plugins,
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
