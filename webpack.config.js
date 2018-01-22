const path = require("path");

const config = {
    entry: path.resolve(__dirname, "./src/index.js"),
    devtool: "source-map",
    output: {
        path: path.join(__dirname, "lib"),
        filename: "react-babylon-3d.min.js",
        library: "ReactBabylon3D",
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    externals: {
        babylonjs: {
            commonjs: "BABYLON",
            commonjs2: "BABYLON",
            amd: "BABYLON",
            root: "BABYLON",
        },
        "react-reconciler": "react-reconciler",
        "react": "react",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [path.resolve("./node_modules"), path.resolve("./src")],
        extensions: [".json", ".js"],
    },
};

module.exports = config;
