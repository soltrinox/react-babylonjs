const transformers = require("../helpers/property-transformers");
const setters = require("../helpers/property-setters");

const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.FreeCamera(
        props.name,
        new BABYLON.Vector3(...props.position),
        scene
    );
    scene.activeCamera = component;
    if (props.defaultTarget) {
        component.setTarget(new BABYLON.Vector3(...props.defaultTarget));
    }
    return component;
};

const props = {
    position: { newComponentRequired: true },
    defaultTarget: { newComponentRequired: true },
    target: {
        setter: (component, value) => component.setTarget(value),
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

const freeCamera = { type: "freeCamera", createComponent, props };

module.exports = freeCamera;
