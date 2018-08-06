const disposers = require("../helpers/property-disposers");
const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.ShaderMaterial(
        props.name,
        scene,
        props.shaderPath,
        {
            attributes: Array.from(props.attributes || []),
            uniforms: Array.from(props.uniforms || []),
        }
    );
    return component;
};

const props = {
    name: {
        setter: setters.property("name"),
    },
    shaderPath: { newComponentRequired: true },
    attributes: { newComponentRequired: true },
    uniforms: { newComponentRequired: true },

    diffuseColor: {
        setter: setters.property("diffuseColor"),
        transformer: transformers.vector3,
    },
    backFaceCulling: { setter: setters.property("backFaceCulling") },

    width: { setter: setters.setFloat("width") },
    height: { setter: setters.setFloat("height") },
    boxSize: { setter: setters.setFloat("boxSize") },
    edgeColor: {
        setter: setters.setVector4("edgeColor"),
        transformer: transformers.vector4,
    },
    hue: {
        setter: setters.setVector4("hue"),
        transformer: transformers.vector4,
    },

    tileTex: {
        setter: setters.setTexture("tileTex"),
        transformer: transformers.component,
        dispose: disposers.component,
    },
};

const shaderMaterial = {
    superTypes: ["material"],
    type: "shaderMaterial",
    createComponent,
    props,
};

module.exports = shaderMaterial;
