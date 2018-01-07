import React from "react";
import BABYLON from "babylonjs";

const { elements: { styles } } = require("react-babylonjs-3d");

const skyMaterial = styles.standardMaterial({
    name: "skyboxMaterial",
    backFaceCulling: false,
    diffuseColor: [0, 0, 0],
    specularColor: [0, 0, 0],
    reflectionTexture: styles.cubeTexture({
        url: "assets/textures/nebula",
        coordinatesMode: BABYLON.Texture.SKYBOX_MODE,
    }),
});

const Sky = ({ size }) => (
    <box
        name="skybox"
        size={size}
        infiniteDistance={true}
        material={skyMaterial}
    />
);

export default Sky;
