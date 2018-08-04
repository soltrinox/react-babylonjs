const transformers = require("../helpers/property-transformers");
const setters = require("../helpers/property-setters");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.ArcRotateCamera(
        props.name,
        props.alpha,
        props.beta,
        props.radius,
        new BABYLON.Vector3(...props.target),
        scene
    );

    scene.activeCamera = component;

    return component;
};

const props = {
    alpha: { newComponentRequired: true },
    beta: { newComponentRequired: true },
    radius: { newComponentRequired: true },
    target: {
        setter: (component, value) => component.setTarget(value),
        transformer: transformers.vector3,
    },
    position: {
        setter: (component, value) => component.setPosition(value),
        transformer: transformers.vector3,
    },
    attachControl: {
        setter: setters.apply,
        transformer: (context, value) => {
            if (value === true) {
                return component =>
                    component.attachControl(context.canvas, true);
            }
            return component => component.detachControl(context.canvas);
        },
    },
};

const arcRotateCamera = { type: "arcRotateCamera", createComponent, props };

module.exports = arcRotateCamera;
