[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/viniciusrmcarneiro/react-babylonjs/issues)
[![Coverage Status](https://coveralls.io/repos/github/viniciusrmcarneiro/react-babylonjs/badge.svg?branch=master)](https://coveralls.io/github/viniciusrmcarneiro/react-babylonjs?branch=master)
[![Build Status](https://travis-ci.org/viniciusrmcarneiro/react-babylonjs.svg)](https://travis-ci.org/viniciusrmcarneiro/react-babylonjs)
[![bitHound Overall Score](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/score.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs)
[![bitHound Code](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/code.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs)
[![Dependency Status](https://david-dm.org/viniciusrmcarneiro/react-babylonjs.svg)](https://david-dm.org/viniciusrmcarneiro/react-babylonjs) 
[![devDependencies Status](https://david-dm.org/viniciusrmcarneiro/react-babylonjs/dev-status.svg)](https://david-dm.org/viniciusrmcarneiro/react-babylonjs?type=dev)
[![npm version](https://badge.fury.io/js/react-babylonjs-3d.svg)](https://badge.fury.io/js/react-babylonjs-3d)


# react-babylonjs

## This package is under development and for now it doesn't offer much... keep reading and find out what it already can do and what it will do...

### So far
The better way to get started is to clone this [repo](https://github.com/viniciusrmcarneiro/react-babylonjs-3d-example), it's a very simple example. Doing that you could focus on how you can compose your BABYLON components.

For a more advanced use, you can have a look on the folder `examples` on this very repo, be advised that it's not the most simple example, but if you do understand what is going on there you can actually see how to integrate this library into an existend BABYLON project.
To get this repo's examples running follow these steps:
```bash
git clone https://github.com/viniciusrmcarneiro/react-babylonjs.git
npm install
cd examples
npm install
npm start
```
Then open on the browser the address http://localhost:8080/.
As prove of concept this project is already using a virtual tree and abstracting away all the code that we would have to write if we were using directly BabylonJS.

The idea was abstract way all the complexity required to create graphs using BabylonJS.
Inspired by ReactJS, CycleJS I decided to borrow the VirtualDOM concept to fill the gap between BabylonJS and the declarative paradigm. Also it's very easy to attach it to a RxJS Stream.

This project was meant to use the react reconciler, but unfortunately the reconciler  component was public in the react v16 alphas dind't make to the official version. But there is hope, I'm waiting for this [PR](https://github.com/facebook/react/pull/10758) to be approved and then this project will be 100% react for BabylonJS, enabling state and life cycle methods.

but for now that is all you can do:
* create pure components(stateless)
* compose visual components
* compose behaviour
* JSX syntax to BabylonJS 3D(camera, mesh, material, texture, shader material, light....)
* share resources in very simple and clear way

There are alot of things to implement. As this project is in it's very early stage, some very simple things are still to be implemented. So far the ROADMAP is:
- [ ] Guideline for contribution
- [ ] Documentation(always working in progress)
- [x] React reconciler <https://github.com/facebook/react/pull/10758>
- [ ] Exemple with Redux
~~- [ ] Exemple with RxJS~~
- [ ] unit test for node components
- [ ] events hook/actions
~~- [ ] special node for custom components(JSX)~~
~~- [ ] implement lazy load(Thunks)~~
- [x] refactor to compose all the properties and behaviours
- [ ] layout(flexbox)
- [x] set materials and textures as style
- [x] support for hot reload
- [ ] animations
- [ ] driver for CycleJS
- [ ] lint/eslint
- [x] webpack
- [x] unit test for api
- [x] examples
- [x] CI travis
- [x] create npm package
- [x] Coveralls
- [x] support creation of library components(JSX)
- [x] component defaultProperty

Don't be shy, if you want to help, just create a pull request. 

Look how easy it can be to create 3D graphs using JSX syntax:

Look how it looks like:
```jsx
const BABYLON = require('babylonjs');
const { hhh, createRender } = require('react-babylonjs-3d');

// this is very important, it's the pragma for the JSX syntax
// this is very important, it's the pragma for the JSX syntax
// this is very important, it's the pragma for the JSX syntax
/** @jsx hhh */

const Camera = ({ position }) => (
    <freeCamera name="camera1" position={position} defaultTarget={[0, 0, 1]} inputs={[]}>
        <fxaaPostProcess options={1} samplingMode={BABYLON.Texture.TRILINEAR_SAMPLINGMODE} />
    </freeCamera>
);

const ScenarioGround = () => (
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

const Sky = ({ size, infiniteDistance }) => (
    <box name="skybox" size={size} infiniteDistance={infiniteDistance}>
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
Sky.defaultProps = { size: 1000, infiniteDistance: true };

// now using all the components created above
const Scenario = ({y, z}) => <scene clearColor={[0, 0, 0]}>
    <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
    <Camera position={[0, y, z]} />
    <Sky size={1000} infiniteDistance={true} />
    <ScenarioGround />
</scene>

// you have to have a canvas element in you html
// getting the canvas element where to render the scene
const canvas = document.querySelector('canvas');


// create the react-babylonjs-3d renderer
// and takes care all the BABYLON stuff(engine, scene, runRenderLoop).
// it makes our live easier
const renderer = createRender({ BABYLON, canvas });

// now lets render the component you've just declared
renderer.render(<Scenario y={5} z={-16} />);

// after 2000ms  let's change the property z
setTimeout(function() {
    renderer.render(<Scenario y={5} z={-12} />);
}, 2000);

// after 5000ms  let's change the property z
setTimeout(function() {
    renderer.render(<Scenario y={5} z={-9} />);
}, 5000);

// As react-babylonjs-3d uses a virtual tree, it actually just updates the changed values.
// So, you can call renderer.render as many time as you need, or even better whenever the state changes.

```
As you can see the react-babylon-3d has already a few components already implemented, see the list of all the properties and components available:

- [x] BABYLON.FxaaPostProcess - ('fxaa', 1, BABYLON.Texture.TRILINEAR_SAMPLINGMODE) hard-coded(I'll fix it)
- [x] BABYLON.FreeCamera - (name, defaultTarget, inputs, position) 
- [x] BABYLON.HemisphericLight - (name, intensity, target)
- [x] BABYLON.StandardMaterial - (name, backFaceCulling, reflectionTexture, diffuseColor, specularColor
- [x] BABYLON.ShaderMaterial - (name, shaderPath, attributes, uniforms, edgeColor, hue, boxSize, width, height, tileTex, textureSampler)
- [x] BABYLON.Mesh.CreateSphere - (name, subdivisions, diameter, position)
- [x] BABYLON.Mesh.CreateGround- (name, width, height, subdivisions, position, material)
- [x] BABYLON.MeshBuilder.CreateBox - (name, options, ellipsoid, position, material)
- [x] BABYLON.Mesh.CreateBox - (name, size, ellipsoid, position, material)
- [x] BABYLON.Texture - (url)
- [x] BABYLON.CubeTexture - (url)
- [x] BABYLON.Scene - (clearColor)


As you can see there are a lot of missing components and properties, also there are some hard-coded properties as well.


## CSS FLAVOR - JUST A PROPOSAL ##
***this is just an idea from a friend, he suggested to create a style property instead of components. It's still not implemented, but I would love to know what you guys think about it.***
I guess that it would look like:
```jsx
<scene style={{ clearColor:[0, 1, 0] }}>
    <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
    <freeCamera name="camera1" 
        style={{
            fxaaPostProcess: {
                options: 1,
                samplingMode: BABYLON.Texture.TRILINEAR_SAMPLINGMODE,  
            },
        }}
        position={[0, 5, -10]}
        defaultTarget={[0, 0, 0]}
        inputs={[defaultCameraKeyboardMoveInput, defaultCameraMouseZoomInput]}
    />
    <box name="skybox" size={1000} infiniteDistance={true}
        style={{
            standardMaterial: {
                backFaceCulling: false,
                diffuseColor: [0, 0, 0],
                specularColor: [0, 0, 0],
                cubeTexture: {
                    url: "assets/textures/nebula",
                    coordinatesMode: BABYLON.Texture.SKYBOX_MODE,
                },
            },  
        }}
    />
</scene>
```

[![https://nodei.co/npm/react-babylonjs-3d.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/react-babylonjs-3d.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/react-babylonjs-3d)

[![bitHound Dependencies](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/dependencies.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/devDependencies.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/master/dependencies/npm)
[![Node version](https://img.shields.io/node/v/react-babylonjs-3d.svg?style=flat)](https://github.com/viniciusrmcarneiro/react-babylonjs)
[![HitCount](http://hits.dwyl.com/viniciusrmcarneiro/react-babylonjs.svg)](http://hits.dwyl.com/viniciusrmcarneiro/react-babylonjs)
