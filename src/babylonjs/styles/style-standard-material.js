const disposers = require("../helpers/property-disposers");
const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.StandardMaterial(props.name, scene);
    return component;
};

const props = {
    name: { setter: setters.property("name") },
    backFaceCulling: { setter: setters.property("backFaceCulling") },
    diffuseColor: {
        setter: setters.property("diffuseColor"),
        transformer: transformers.vector3,
    },

    specularColor: {
        setter: setters.property("specularColor"),
        transformer: transformers.vector3,
    },
    emissiveColor: {
        setter: setters.property("emissiveColor"),
        transformer: transformers.vector3,
    },
    ambientColor: {
        setter: setters.property("ambientColor"),
        transformer: transformers.vector3,
    },

    reflectionTexture: {
        setter: setters.propertyFromComponent("reflectionTexture"),
        transformer: transformers.component,
        dispose: disposers.component,
    },

    diffuseTexture: {
        setter: setters.propertyFromComponent("diffuseTexture"),
        transformer: transformers.component,
        dispose: disposers.component,
    },
};

const standardMaterial = {
    superTypes: ["material"],
    type: "standardMaterial",
    createComponent,
    props,
};

module.exports = standardMaterial;
