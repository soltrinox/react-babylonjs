const { Node, babylonJSRenderer } = require("./react-api");
const componentManager = require("./babylonjs/helpers/component-manager");
const elements = require("./babylonjs/elements");

const createRenderer = ({ BABYLON, canvas }) => {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const rootNode = new Node("root", {
        BABYLON,
        canvas,
        componentManager: componentManager.create(),
        elements,
        engine,
        scene,
        logger: console,
    });

    const rootContainer = babylonJSRenderer.createContainer(rootNode);

    const startLoop = (function() {
        let loopStarted = false;
        return () => {
            if (!loopStarted) {
                loopStarted = true;
                engine.runRenderLoop(() => scene.render());
            }
        };
    })();

    const render = Component => {
        babylonJSRenderer.updateContainer(Component, rootContainer, null, () =>
            startLoop()
        );
    };

    const dispose = () => {};

    return {
        render,
        dispose,
    };
};

module.exports = { createRenderer, elements };
