// http://www.babylonjs-playground.com/#1YD970#4
import React from "react";

const { elements: { styles } } = require("react-babylonjs-3d");

const wheelMaterial = styles.standardMaterial({
    name: "wheel_mat",
    diffuseTexture: styles.texture({
        url: "http://i.imgur.com/ZUWbT6L.png",
    }),
});

class Sample3 extends React.Component {
    render() {
        return [
            <arcRotateCamera
                key="camera"
                name="arc-1"
                position={[-12, 10, -24]}
                target={[0, 0, 0]}
                attachControl={true}
                alpha={0}
                beta={0}
                radius={0}
            />,

            <hemisphericLight key="light" name="light-1" target={[1, 0.5, 0]} />,

            <cylinder
                key="body"
                diameter={3}
                height={1}
                tessellation={24}
                faceColors={[, [0, 0, 0]]}
                faceUV={[[0, 0, 1, 1], , [0, 0, 1, 1]]}
                material={wheelMaterial}
                rotation={[Math.PI / 2, 0, 0]}
            />,
        ];
    }
}

export default Sample3;
