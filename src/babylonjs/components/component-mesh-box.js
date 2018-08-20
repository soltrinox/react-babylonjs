const disposers = require("../helpers/property-disposers");
const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.Mesh.CreateBox(props.name, props.size, scene);
    return component;
};

const props = {
    name: {
        setter: setters.property("name"),
    },
    size: { newComponentRequired: true },
    infiniteDistance: {
        setter: setters.property("infiniteDistance"),
    },
    width: { setter: setters.property("width") },
    height: { setter: setters.property("height") },
    subdivisions: { setter: setters.property("subdivisions") },
    material: {
        setter: setters.propertyFromComponent("material"),
        transformer: transformers.component,
        dispose: disposers.component,
    },
    position: {
        setter: setters.property("position"),
        transform: transformers.vector3,
    },
};

const box = { superTypes: ["mesh"], type: "box", createComponent, props };
module.exports = box;
