const ReactFiberReconciler = require("react-reconciler");
const BabylonjsRenderer = require("./babylonjs-renderer");
const Node = require("./node.js");
const logger = { debug: () => {} };

const babylonJSRenderer = ReactFiberReconciler(
    BabylonjsRenderer({ Node, logger })
);

babylonJSRenderer.injectIntoDevTools({
    bundleType: 1, // 0 for PROD, 1 for DEV
    version: "0.2.0", // version for your renderer
    rendererPackageName: "react-babylonjs-3d", // package name
});

module.exports = {
    babylonJSRenderer,
    Node,
};
