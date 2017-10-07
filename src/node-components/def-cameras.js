const DefaultCameraKeyboardMoveInput = require('./camera/default-camera-keyboard-move-input');
const DefaultCameraMouseZoomInput = require('./camera/default-camera-mouse-zoom-input');

const defaultCameraMouseZoomInput = {
    tagName: 'defaultCameraMouseZoomInput',
    props: {
        parent: {
            createIfNotExists: true,
        },
    },

    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        const cmp = new DefaultCameraMouseZoomInput(BABYLON);
        return cmp;
    },
};

const defaultCameraKeyboardMoveInput = {
    tagName: 'defaultCameraKeyboardMoveInput',
    props: {
        parent: {
            createIfNotExists: true,
        },
    },

    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        const cmp = new DefaultCameraKeyboardMoveInput(BABYLON);
        return cmp;
    },
};

const fxaaPostProcess = {
    tagName: 'fxaaPostProcess',
    props: {
        parent: { createIfNotExists: true },
        camera: { createIfNotExists: true, everySet: true },
    },
    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        // first iteration will happen after the parent is created
        // so the camera doesn't exist
        // the second iteration
        if (!node.camera || !node.camera.babylonCMP) {
            return null;
        }

        const cmp = new BABYLON.FxaaPostProcess(
            'fxaa',
            1,
            node.camera.babylonCMP,
            BABYLON.Texture.TRILINEAR_SAMPLINGMODE
        );

        return cmp;
    },
};

const freeCamera = {
    tagName: 'freeCamera',
    props: {
        parent: { createIfNotExists: true },
        position: { recreate: true },
        defaultTarget: {
            setOnce: true,
            setter: (oldValue, newValue, node, cmp, { BABYLON }) => {
                if (newValue) {
                    cmp.setTarget(new BABYLON.Vector3(...newValue));
                }
            },
        },
        inputs: {
            createOnGet: true,
            creator: (node, cmp) => {
                const items = [];

                return {
                    push: value => {
                        items.push(value);
                    },
                    remove: value => {
                        const i = items.indexOf(value);
                        if (i > -1) {
                            items.splice(i, 1);
                        }
                    },
                    _items: items,
                };
            },
        },
        babylonCMP: {
            setter: (oldValue, newValue, node, cmp, { canvas, scene }) => {
                if (oldValue != newValue) {
                    if (oldValue) {
                        oldValue.detachControl(canvas);
                        const index = scene.activeCameras.indexOf(oldValue);
                        if (index > -1) {
                            scene.activeCameras.splice(index, 1);
                        }
                    }

                    scene.activeCameras.push(newValue);
                    newValue.attachControl(canvas, true);

                    if (node.inputs._items) {
                        node.inputs._items.forEach(item => {
                            newValue.inputs.add(item);
                        });
                    }

                    node.children.filter(child => child.tagName === 'parent').forEach(child => {
                        child.parent = node;
                    });
                }
            },
        },
    },

    creator: (propsSetters, context, node) => () => {
        const { BABYLON, scene } = context;
        const cmp = new BABYLON.FreeCamera(node.name, new BABYLON.Vector3(...node.position), scene);
        cmp.inputs.removeByType('FreeCameraKeyboardMoveInput');

        propsSetters.defaultTarget.setter(
            node.defaultTarget,
            node.defaultTarget || null,
            node,
            cmp,
            context
        );
        return cmp;
    },
};

module.exports = [
    defaultCameraMouseZoomInput,
    defaultCameraKeyboardMoveInput,
    fxaaPostProcess,
    freeCamera,
];
