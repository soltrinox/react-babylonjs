const { compose } = require("./helpers/composer");
const propertyUpdater = require("./helpers/property-updater");
const { fromPairs } = require("./helpers/functional");
const propertyActionManager = require("./properties/property-action-manager");

const styles = {
    standardMaterial: props => ({ type: "standardMaterial", props }),
    shaderMaterial: props => ({ type: "shaderMaterial", props }),
    texture: props => ({ type: "texture", props }),
    cubeTexture: props => ({ type: "cubeTexture", props }),
};

const _superType = {
    mesh: {
        actionManager: propertyActionManager,
    },
};
const byType = fromPairs(
    [
        require("./components/component-action-manager"),

        require("./components/component-scene"),
        require("./components/component-mesh-box"),
        require("./components/component-mesh-ground"),
        require("./components/component-mesh-cylinder"),
        require("./components/component-mesh-extrude-shape"),
        require("./components/component-mesh-lines"),

        require("./components/component-mesh-sphere"),
        require("./components/component-free-camera"),
        require("./components/component-arc-rotate-camera"),

        require("./components/component-hemispheric-light"),

        require("./styles/style-shader-material"),
        require("./styles/style-standard-material"),

        require("./styles/style-texture"),
        require("./styles/style-cube-texture"),
    ].map(({ superTypes = [], type, props, createComponent }) => {
        const allProps = superTypes
            .map(superType => _superType[superType])
            .filter(superType => superType)
            .reduce(
                (acc, tempProp) => Object.assign(acc, tempProp),
                Object.assign({}, props)
            );

        return [
            type,
            compose(
                type,
                { props: allProps, createComponent },
                propertyUpdater(type, allProps)
            ),
        ];
    })
);

module.exports = { styles, byType };
