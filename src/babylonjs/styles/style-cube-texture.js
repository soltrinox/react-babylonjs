const setters = require("../helpers/property-setters");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.CubeTexture(props.url, scene);
    return component;
};

const props = {
    url: { newComponentRequired: true },
    coordinatesMode: {
        setter: setters.property("coordinatesMode"),
    },
};

const cubeTexture = {
    superTypes: ["cubeTexture"],
    type: "cubeTexture",
    createComponent,
    props,
};

module.exports = cubeTexture;
