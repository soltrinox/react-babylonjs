const { compose } = require("./helpers/composer");
const propertyUpdater = require("./helpers/property-updater");

const styles = {
    standardMaterial: props => ({ type: "standardMaterial", props }),
    shaderMaterial: props => ({ type: "shaderMaterial", props }),
    texture: props => ({ type: "texture", props }),
    cubeTexture: props => ({ type: "cubeTexture", props }),
};

const fromPairs = arr =>
    arr.reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});

const byType = fromPairs(
    [
        require("./components/component-scene"),
        require("./components/component-mesh-box"),
        require("./components/component-mesh-ground"),
        require("./components/component-mesh-sphere"),
        require("./components/component-free-camera"),
        require("./components/component-hemispheric-light"),

        require("./styles/style-shader-material"),
        require("./styles/style-standard-material"),

        require("./styles/style-texture"),
        require("./styles/style-cube-texture"),
    ].map(({ type, props, createComponent }) => [
        type,
        compose(type, { props, createComponent }, propertyUpdater(type, props)),
    ])
);

module.exports = { styles, byType };
