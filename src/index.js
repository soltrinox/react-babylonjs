const { createBabylonSceneAPI } = require('./babylon-scene-api');
const { createApp } = require('./component');
const hhh = require('./hhh');
const hh = require('./hh');

const createRender = ({ BABYLON, canvas }) => {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const api = createBabylonSceneAPI({ canvas, BABYLON, engine, scene });
    const app = createApp({ api });
    const renderLoop = () => api.scene.render();

    return {
        render(component) {
            if (!renderLoop.started) {
                renderLoop.started = true;
                engine.runRenderLoop(renderLoop);
            }

            app.render(component);
        },
        dispose() {
            app.dispose();
            engine.dispose();
        },
    };
};

module.exports = {
    createBabylonSceneAPI,
    createApp,
    hhh,
    hh,
    createRender,
};
