import React from "react";

const { elements: { styles } } = require("react-babylonjs-3d");

const groundTexture = styles.texture({
    url: "/assets/textures/tile.png",
});

const groundMaterial = styles.shaderMaterial({
    name: "ground-tiled-1",
    shaderPath: "/assets/shaders/groundTile",
    attributes: ["position", "uv"],
    uniforms: [
        "worldViewProjection",
        "boxSize",
        "width",
        "height",
        "edgeColor",
        "hue",
    ],
    width: 2000,
    height: 2000,
    boxSize: 0.5,
    edgeColor: [0, 0, 0, 1.0],
    hue: [0.3, 0.3, 0.3, 1.0],
    tileTex: groundTexture,
});

const ScenarioGround = () => (
    <ground
        name="ground1"
        width={2000}
        height={2000}
        subdivisions={2}
        position={[0, 0, 0]}
        material={groundMaterial}
    />
);

export default ScenarioGround;
