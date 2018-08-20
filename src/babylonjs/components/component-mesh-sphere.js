const disposers = require("../helpers/property-disposers");
const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = BABYLON.Mesh.CreateSphere(
        props.name,
        props.segments,
        props.diameter,
        scene
    );
    return component;
};

const props = {
    segments: { newComponentRequired: true },
    diameter: { newComponentRequired: true },
    infiniteDistance: { setter: setters.property("infiniteDistance") },
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

const sphere = { superTypes: ["mesh"], type: "sphere", createComponent, props };
module.exports = sphere;
