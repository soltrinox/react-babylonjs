# react-babylonjs

## This package is under development and for now it doesn't offer any functionality, please don't install it, not just yet... But keep reading and find out what it's going to do...
======

### So far
For now all you can do is clone this repo, run `npm install` and `npm start`.
Then open on the browser the address http://localhost:8080/.
As prove of concept this project is already using a virtual tree and abstracting away all the code that we would have to write if we were using directly BabylonJS.

The idea was abstract way all the complexity required to create graphs using BabylonJS.
Inspired by ReactJS, CycleJS I decided to borrow the VirtualDOM concept to fill the gap between BabylonJS and the declarative paradigm.

This projects allows you to:
* create pure components(stateless)
* compose visual components
* compose behaviour
* JSX syntax to BabylonJS 3D(camera, mesh, material, texture, shader material, light....)
* share resources in very simple and clear way

There are alot of things to implement. As this project is in it's very early stage, some very simple things are still to be implemented. So far the ROADMAP is:
* unit test
* compose all the properties and behaviours
* events hook
* ~~webpack~~
* layout(flexbox)
* set materials and textures as style
* create npm package
* support for hot reload
* support creation of library components(JSX)
* animations
* driver for CycleJS
* documentation

Don't be shy, if you want to help, just create a pull request. 

Look how easy it can be to create 3D graphs using JSX syntax:

1. - parent property setter flavor
```jsx
<scene clearColor={[0, 1, 0]}>
    <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
    <freeCamera name="camera1" position={[0, 5, -10]} defaultTarget={[0, 0, 0]}>
        <parent name="camera">
            <fxaaPostProcess />
        </parent>
        <parentPropList name="inputs">
            <defaultCameraMouseZoomInput />
            <defaultCameraKeyboardMoveInput />
        </parentPropList>
    </freeCamera>

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
</scene>
```

2. - css flavor
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
    >
        <parentPropList name="inputs">
            <defaultCameraMouseZoomInput />
            <defaultCameraKeyboardMoveInput />
        </parentPropList>
    </freeCamera>

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
