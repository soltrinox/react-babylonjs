const BABYLON = require('babylonjs');
const { createBabylonSceneAPI } = require('../../src/babylon-scene-api');
const { createComponent } = require('../../src/component');

const canvas = document.querySelector('#canvas-container');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const api = createBabylonSceneAPI({ BABYLON, canvas, engine, scene });
const component = createComponent({
    api,
});

// const Sky = require('./sky');
// const ScenarioGround = require('./scenario-ground');

// const vtree = (y, z) =>
//     hh('scene', {}, [
//         hh('hemisphericLight', {
//             props: {
//                 name: 'light1',
//                 target: [0, 1, 0],
//                 intensity: 0.5,
//             },
//         }),
//         hh(
//             'freeCamera',
//             {
//                 props: {
//                     name: 'camera1',
//                     position: [0, y, z],
//                     defaultTarget: [0, 0, 1],
//                     inputs: [],
//                 },
//             },
//             [
//                 hh('fxaaPostProcess', {
//                     props: { options: 1, samplingMode: BABYLON.Texture.TRILINEAR_SAMPLINGMODE },
//                 }),
//             ]
//         ),
//         Sky({ props: { name: 'skybox', size: 1000, infiniteDistance: true } }),
//         ScenarioGround({
//             props: {
//                 name: 'ground1',
//                 width: 2000,
//                 height: 2000,
//                 subdivisions: 2,
//                 position: [0, 0, 0],
//             },
//         }),
//     ]);

// component.render(vtree(5, -16));

// setTimeout(() => component.render(vtree(5, -1)), 5000);

const Sky = (
    <box name="skybox" size={1000} infiniteDistance={true}>
        <parentProp name="material">
            <standardMaterial
                name="skyboxMaterial"
                backFaceCulling={false}
                diffuseColor={[0, 0, 0]}
                specularColor={[0, 0, 0]}
            >
                <parentProp name="reflectionTexture">
                    <cubeTexture
                        url="assets/textures/nebula"
                        coordinatesMode={BABYLON.Texture.SKYBOX_MODE}
                    />
                </parentProp>
            </standardMaterial>
        </parentProp>
    </box>
);

const ScenarioGround = (
    <ground name="ground1" width={2000} height={2000} subdivisions={2} position={[0, 0, 0]}>
        <parentProp name="material">
            <shaderMaterial
                name="ground1-tile"
                attributes={['position', 'uv']}
                uniforms={['worldViewProjection', 'boxSize', 'width', 'height', 'edgeColor', 'hue']}
                width={2000}
                height={2000}
                boxSize={0.5}
                edgeColor={[0, 0, 0, 1.0]}
                hue={[0.3, 0.3, 0.3, 1.0]}
                shaderPath="/assets/shaders/groundTile"
            >
                <parentProp name="tileTex">
                    <texture url="/assets/textures/vpc-tile.png" />
                </parentProp>
            </shaderMaterial>
        </parentProp>
    </ground>
);

const vtree2 = ({ y, z }) => (
    <scene clearColor={[0, 0, 0]}>
        <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
        <freeCamera name="camera1" position={[0, y, z]} defaultTarget={[0, 0, 1]} inputs={[]}>
            <fxaaPostProcess options={1} samplingMode={BABYLON.Texture.TRILINEAR_SAMPLINGMODE} />
        </freeCamera>
        {Sky}
        {ScenarioGround}
    </scene>
);

component.render(vtree2( {y:5 z:-16 }));

window.addEventListener('resize', function() {
    engine.resize();
});

setTimeout(function() {
    engine.runRenderLoop(() => scene.render());
}, 1000);
