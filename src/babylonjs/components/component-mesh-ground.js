const disposers = require("../helpers/property-disposers");
const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = BABYLON.Mesh.CreateGround(
        props.name,
        props.width,
        props.height,
        props.subdivisions,
        scene
    );
    return component;
};

const props = {
    name: {
        setter: setters.property("name"),
    },
    width: { newComponentRequired: true },
    height: { newComponentRequired: true },
    subdivisions: { newComponentRequired: true },
    position: {
        setter: setters.property("position"),
        transformer: transformers.vector3,
    },
    material: {
        setter: setters.propertyFromComponent("material"),
        transformer: transformers.component,
        dispose: disposers.component,
    },
};

const ground = { superTypes: ["mesh"], type: "ground", createComponent, props };
module.exports = ground;
