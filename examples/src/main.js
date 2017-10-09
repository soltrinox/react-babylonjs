const BABYLON = require('babylonjs');
const { createBabylonSceneAPI, createApp } = require('react-babylonjs-3d');

const Camera = require('./camera');
const Sky = require('./sky');
const ScenarioGround = require('./scenario-ground');

const components = Array.from(document.querySelectorAll('.component'))
    .map(canvas => ({ engine: new BABYLON.Engine(canvas, true), canvas }))
    .map(({ engine, canvas }) => ({ scene: new BABYLON.Scene(engine), engine, canvas }))
    .map(props => createBabylonSceneAPI(Object.assign({ BABYLON }, props)))
    .map(api => ({ component: createApp({ api }), api }));

// the camera's position is always the same
const VTree1 = () => (
    <scene clearColor={[0, 0, 0]}>
        <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
        <Camera position={[0, 5, -16]} />
        <Sky size={1000} infiniteDistance={true} />
        <ScenarioGround />
    </scene>
);

// render at the same position
const VTree2 = ({ cameraZ }) => (
    <scene clearColor={[0, 0, 0]}>
        <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
        <Camera position={[0, 5, cameraZ]} />
        <Sky size={1000} infiniteDistance={true} />
        <ScenarioGround />
    </scene>
);

const _VIEWS = {
    VTree2,
    VTree1,
};

const viewsToRender = components
    .map(obj => {
        const viewName = obj.api.canvas.dataset.view;
        return Object.assign({ view: _VIEWS[viewName], viewName }, obj);
    })
    // just to be safe, it has to match a view from _VIEWS
    .filter(({ view }) => view);

viewsToRender.forEach(({ viewName, view, component, api }) => {
    let cameraZ = -1;
    component.render(view({ cameraZ }));

    const myInterval = setInterval(function() {
        cameraZ = cameraZ - 0.07;
        component.render(view({ cameraZ }));

        if (cameraZ < -16) {
            cameraZ = -16;
            clearInterval(myInterval);
            component.render(view({ cameraZ }));
        }
    }, 15);

    window.addEventListener('resize', function() {
        api.engine.resize();
    });

    api.engine.runRenderLoop(() => api.scene.render());
});
