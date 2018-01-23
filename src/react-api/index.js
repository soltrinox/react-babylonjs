const ReactFiberReconciler = require("react-reconciler");
const BabylonJSRenderer = ReactFiberReconciler(require("./babylonjs-renderer"));
const Node = require("./node.js");

BabylonJSRenderer.injectIntoDevTools({
    bundleType: 0, // 0 for PROD, 1 for DEV
    version: "0.2.0", // version for your renderer
    rendererPackageName: "react-babylonjs-3d", // package name
});

module.exports = {
    BabylonJSRenderer,
    Node,
};
