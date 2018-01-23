[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/viniciusrmcarneiro/react-babylonjs/issues)
[![Coverage Status](https://coveralls.io/repos/github/viniciusrmcarneiro/react-babylonjs/badge.svg?branch=master)](https://coveralls.io/github/viniciusrmcarneiro/react-babylonjs?branch=master)
[![Build Status](https://travis-ci.org/viniciusrmcarneiro/react-babylonjs.svg)](https://travis-ci.org/viniciusrmcarneiro/react-babylonjs)
[![bitHound Overall Score](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/score.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs)
[![bitHound Code](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/code.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs)
[![Dependency Status](https://david-dm.org/viniciusrmcarneiro/react-babylonjs.svg)](https://david-dm.org/viniciusrmcarneiro/react-babylonjs) 
[![devDependencies Status](https://david-dm.org/viniciusrmcarneiro/react-babylonjs/dev-status.svg)](https://david-dm.org/viniciusrmcarneiro/react-babylonjs?type=dev)
[![npm version](https://badge.fury.io/js/react-babylonjs-3d.svg)](https://badge.fury.io/js/react-babylonjs-3d)

# react-babylonjs-3d

 
![Screenshot of the code bellow][screenshot1]

Look how easy it can be to create 3D objects using JSX syntax:
### index.js
```jsx
import React from "react";
import BABYLON from "babylonjs";
import ReactBabylonJS from "react-babylonjs-3d";

import App from "./app";

// you have to have a canvas element in you html
// getting the canvas element where to render the scene
const canvas = document.querySelector('canvas');

const renderer = ReactBabylonJS.createRenderer({ BABYLON, canvas });
renderer.render(<App />);
```

### app.js
```jsx
import React from "react";

const { elements: { styles } } = require("react-babylonjs-3d");

const ScenarioGround = () => (
    <ground
        name="ground1"
        width={2000}
        height={2000}
        subdivisions={2}
        position={[0, 0, 0]}
    >
);
```
```jsx
const skyMaterial = styles.standardMaterial({
    name: "skyboxMaterial",
    backFaceCulling: false,
    diffuseColor: [0, 0, 0],
    specularColor: [0, 0, 0],
});
```
```jsx
const Sky = ({ size }) => (
    <box
        name="skybox"
        size={size}
        infiniteDistance={true}
        material={skyMaterial}
    />
);
```
```jsx
class App extends React.Component {
    render() {
        return (
            <scene clearColor={[1, 1, 1]} ambientColor={[1, 0, 0]}>
                <freeCamera
                    position={[0, 5, -16]}
                    defaultTarget={[0, 0, 0]}
                    attachControl={true}
                />

                <hemisphericLight
                    name="light1"
                    target={[0, 1, 0]}
                    intensity={0.5}
                />

                <SkyNebule size={1000} />

                <GroundGrid />

                <sphere
                    key="sphere-0"
                    position={[3, 5, 0]}
                    segments={16}
                    diameter={2}
                />

            </scene>
        );
    }
}

export default App;
```

## This package is under development and for now it doesn't offer much... keep reading and find out what it already can do and what it will do...

## implemented
### components
- [x] BABYLON.FreeCamera - (name, defaultTarget, inputs, position) 
- [x] BABYLON.HemisphericLight - (name, intensity, target)
- [x] BABYLON.Mesh.CreateSphere - (name, subdivisions, diameter, position)
- [x] BABYLON.Mesh.CreateGround- (name, width, height, subdivisions, position, material)
- [x] BABYLON.MeshBuilder.CreateBox - (name, options, ellipsoid, position, material)
- [x] BABYLON.Mesh.CreateBox - (name, size, ellipsoid, position, material)
- [x] BABYLON.Texture - (url)
- [x] BABYLON.CubeTexture - (url)
- [x] BABYLON.Scene - (clearColor)

### properties(styles)
- [x] BABYLON.StandardMaterial - (name, backFaceCulling, reflectionTexture, diffuseColor, specularColor)
- [x] BABYLON.ShaderMaterial - (name, shaderPath, attributes, uniforms, edgeColor, hue, boxSize, width, height, tileTex, textureSampler)

### So far
The better way to get started is to clone this [repo](https://github.com/viniciusrmcarneiro/react-babylonjs-3d-example), it's a very simple example. Doing that you could focus on how you can compose your BABYLON components.

You can also have a look at the folder `examples` on this very repo.
To get this repo's examples running follow these steps:
```bash
git clone https://github.com/viniciusrmcarneiro/react-babylonjs.git
npm install
cd examples
npm install
npm start
```
Then open on the browser the address http://localhost:8080/.

The idea is to abstract away all the complexity required to create meshes, scenario, engine and ect for BabylonJS.

In order make it possible to have react like components this package uses [react-reconciler](https://www.npmjs.com/package/react-reconciler) and implements fiber's interface, pretty cool hein?


There are alot of things wating to be implemented. As this project is in it's very early stage, some very simple things are still to be implemented. So far the ROADMAP is:
- [ ] events hook/actions
- [ ] unit test for api
- [ ] increase code coverage
- [ ] Guideline for contribution
- [ ] Documentation(always working in progress)
- [ ] layout(flexbox)
- [ ] animations
- [x] eslint
- [x] React reconciler <https://github.com/facebook/react/pull/10758>
- [x] refactor to compose all the properties and behaviours
- [x] set materials and textures as style
- [x] support for hot reload
- [x] webpack
- [x] examples
- [x] CI travis
- [x] Coveralls

Don't be shy, if you want to help, just create a pull request.


As you can see there are a lot of missing components and properties, also there are some hard-coded properties as well.

[![https://nodei.co/npm/react-babylonjs-3d.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/react-babylonjs-3d.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/react-babylonjs-3d)

[![bitHound Dependencies](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/dependencies.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/badges/devDependencies.svg)](https://www.bithound.io/github/viniciusrmcarneiro/react-babylonjs/master/dependencies/npm)
[![Node version](https://img.shields.io/node/v/react-babylonjs-3d.svg?style=flat)](https://github.com/viniciusrmcarneiro/react-babylonjs)
[![HitCount](http://hits.dwyl.com/viniciusrmcarneiro/react-babylonjs.svg)](http://hits.dwyl.com/viniciusrmcarneiro/react-babylonjs)

[screenshot1]: https://github.com/viniciusrmcarneiro/react-babylonjs/raw/master/docs/images/screenshot.png "Sky, Ground and a Sphere"
