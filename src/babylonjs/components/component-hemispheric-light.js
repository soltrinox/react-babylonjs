const setters = require("../helpers/property-setters");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.HemisphericLight(
        props.name,
        new BABYLON.Vector3(...props.target),
        scene
    );
    return component;
};

const props = {
    target: { newComponentRequired: true },
    intensity: { setter: setters.property("intensity") },
    name: { setter: setters.property("name") },
};

const hemisphericLight = { type: "hemisphericLight", createComponent, props };
module.exports = hemisphericLight;
