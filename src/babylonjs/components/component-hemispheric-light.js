const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");

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
};

const hemisphericLight = { type: "hemisphericLight", createComponent, props };
module.exports = hemisphericLight;
