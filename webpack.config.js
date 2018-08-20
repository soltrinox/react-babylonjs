const path = require("path");

const _DEV = process.env.NODE_ENV === "development";

const filename = `react-babylon-3d${_DEV ? "" : ".min"}.js`;
const mode = _DEV ? "development" : "production";

const config = Object.assign(
    {},
    _DEV ? { devtool: "inline-source-map" } : null,
    {
        entry: path.resolve(__dirname, "./src/index.js"),
        mode,
        output: {
            path: path.join(__dirname, "dist"),
            filename,
            library: "ReactBabylon",
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
            react: {
                commonjs: "React",
                commonjs2: "React",
                amd: "React",
                root: "React",
            },
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
    }
);

module.exports = config;
