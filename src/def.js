'use strict';
const BABYLON = require('babylonjs');
const R = require('RAMDA');
const Rx = require('rxjs');
const { h } = require('snabbdom');

const parentPropNameInsertHook = node =>
    node.elm.parentPropName
        ? (node.elm.parent[node.elm.parentPropName] = node.elm.babylonCMP)
        : null;

const parentMesh = node => {
    const cmp = node.elm.babylonCMP;
    if (cmp instanceof BABYLON.Mesh) {
        node.elm.children.forEach(child => {
            if (child.babylonCMP && child.babylonCMP instanceof BABYLON.Mesh) {
                child.babylonCMP.parent = cmp;
            }
        });
    }
};

const _hooks = {
    sphere: {
        insert: parentMesh,
    },
    box: {
        insert: parentMesh,
    },
    ground: {
        insert: parentMesh,
    },
    shaderMaterial: {
        insert: parentPropNameInsertHook,
    },
    fxaaPostProcess: {
        insert: node => {
            node.elm.camera = node.elm.parent;
        },
    },
};
const { DefaultCameraKeyboardMoveInput, DefaultCameraMouseZoomInput } = require('./camera-inputs');

const Scene = (props, children) => h('scene', { props }, children);
const FreeCamera = (props, children) => h('freeCamera', { props }, children);
const HemisphericLight = (props, children) => h('hemisphericLight', { props }, children);
const Sphere = (props, children) => h('sphere', { props, props, hook: _hooks.sphere }, children);
const Ground = (props, children) => h('ground', { props, hook: _hooks.ground }, children);
const ShaderMaterial = (props, children) =>
    h('shaderMaterial', { props, hook: _hooks.shaderMaterial }, children);
const Texture = (props, children) => h('texture', { props }, children);
const Box = (props, children) => h('box', { props, hook: _hooks.box }, children);
const StandardMaterial = (props, children) => h('standardMaterial', { props }, children);
const CubeTexture = (props, children) => h('cubeTexture', { props }, children);

class Node {
    constructor(tagName, engine, scene) {
        this.engine = engine;
        this.scene = scene;
        this.tagName = tagName;
        this.children = [];
        this.props = {};
    }

    addChild(item) {
        // DEBUG(`${this.tagName}.addChild`, Array.from(arguments));
        this.children.push(item);
        item.parent = this;
    }

    addChildAt(item) {
        // DEBUG(`${this.tagName}.addChildAt`, Array.from(arguments));
        this.addChild(item);
    }

    getChildIndex(child) {
        // DEBUG(`${this.tagName}.getChildIndex`, Array.from(arguments));
        return this.children.indexOf(child);
    }

    getChildAt() {
        // DEBUG(`${this.tagName}.getChildAt`, Array.from(arguments));
    }

    removeChild(item) {
        DEBUG(`${this.tagName}.removeChild`, Array.from(arguments));
        while (item.children.length > 0) item.removeChild(item.children[item.children.length - 1]);

        const index = this.children.indexOf(item);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
        if (item.dispose) {
            item.dispose();
        }
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    dispose() {
        // DEBUG(`${this.tagName}.dispose`, this);
        const cmp = this.babylonCMP;
        if (cmp) {
            this.babylonCMP = null;
            cmp.dispose();
        }
    }
}

const createProp = (node, name, opts, { canvas, engine, scene }) =>
    Object.defineProperty(node, name, {
        set: function(value) {
            const newValue = opts.transform ? opts.transform(value) : value;
            const oldValue = this[`_${name}`];
            if (R.equals(oldValue, newValue)) {
                if (!opts.everySet) return;
            }

            if (opts.setOnce) {
                if (oldValue !== undefined) {
                    throw new Error(`${node.tagName}.${name} can't be set more than once`);
                }
            }

            this[`_${name}`] = newValue;
            let created = false;

            if (opts.createIfNotExists && !this.babylonCMP) {
                created = true;
                this.babylonCMP = this.createBabylonComponent();
            }

            if (!this.babylonCMP) {
                return;
            }

            if (!created && opts.recreate) {
                this.babylonCMP = this.createBabylonComponent();
            }

            if (opts.setter) {
                opts.setter(oldValue, newValue, this, this.babylonCMP, { canvas, engine, scene });
            }
        },
        get: function() {
            if (opts.createOnGet && !this[`_${name}`]) {
                this[`_${name}`] = opts.creator(this, this.babylonCMP, { canvas, engine, scene });
            }

            return this[`_${name}`];
        },
    });

class NodeBabylon extends Node {}

const ParentPropListDefinitions = {
    tagName: 'parentPropList',
    props: {
        parent: { createIfNotExists: true },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmps = node.children.map(child => child.babylonCMP);

        cmps.forEach(cmp => node.parent[node.name].push(cmp));

        return {
            dispose: () => cmps.forEach(cmp => node.parent[node.name].remove(cmp)),
        };
    },
    nodeClass: Node,
};

const ParentPropDefinitions = {
    tagName: 'parentProp',
    props: {
        parent: { createIfNotExists: true },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        if (!node.children || node.children.length != 1) {
            let current = node;
            const pathNode = [];
            while (current) {
                pathNode.push(current.tagName);
                current = current.parent;
            }
            throw new Error(`should have one children ${pathNode.join('.')}`);
        }

        const cmp = node.children[0].babylonCMP;
        node.parent[node.name] = cmp;
        return cmp;
    },
    nodeClass: Node,
};

const parentDefinitions = {
    tagName: 'parent',
    props: {
        parent: { createIfNotExists: true, recreate: true, everySet: true },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        node.children.forEach(child => (child[node.name] = node.parent));

        return { dispose: () => node.children.forEach(child => (child[node.name] = null)) };
    },
    nodeClass: Node,
};

const HemisphericLightDefinitions = {
    tagName: 'hemisphericLight',
    props: {
        parent: { createIfNotExists: true },
        intensity: {
            setter: (oldValue, newValue, node, cmp) => {
                cmp.intensity = newValue;
            },
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.HemisphericLight(
            node.name,
            new BABYLON.Vector3(...node.target),
            scene
        );

        propsSetters.intensity.setter(node.intensity, node.intensity, node, cmp);

        return cmp;
    },
};

const defaultCameraMouseZoomInputDefinitions = {
    tagName: 'defaultCameraMouseZoomInput',
    props: {
        parent: {
            createIfNotExists: true,
        },
    },

    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new DefaultCameraMouseZoomInput();
        return cmp;
    },
};

const defaultCameraKeyboardMoveInputDefinitions = {
    tagName: 'defaultCameraKeyboardMoveInput',
    props: {
        parent: {
            createIfNotExists: true,
        },
    },

    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new DefaultCameraKeyboardMoveInput();
        return cmp;
    },
};

const fxaaPostProcessDefinitions = {
    tagName: 'fxaaPostProcess',
    props: {
        parent: {},
        camera: { createIfNotExists: true, recreate: true },
        options: {
            recreate: true,
        },
        samplingMode: { recreate: true },
    },
    delayCreator: true,
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        if (!node.camera || !node.camera.babylonCMP) {
            return null;
        }

        const cmp = new BABYLON.FxaaPostProcess(
            'fxaa',
            node.options,
            node.camera.babylonCMP,
            node.samplingMode
        );

        cmp.dispose = cmp.dispose.bind(cmp, node.camera.babylonCMP);
        return cmp;
    },
};

const FreeCameraDefinitions = {
    tagName: 'freeCamera',
    props: {
        parent: { createIfNotExists: true },
        position: {
            required: true,
            setter: (oldValue, newValue, node, cmp) => {
                cmp.position = new BABYLON.Vector3(...newValue);
            },
        },
        defaultTarget: {
            setOnce: true,
            setter: (oldValue, newValue, node, cmp) => {
                if (newValue) {
                    cmp.setTarget(new BABYLON.Vector3(...newValue));
                }
            },
        },
        inputs: {
            setter: (oldValue, newValue, node, cmp) => {
                oldValue && oldValue.forEach(input => cmp.inputs.remove(input));
                newValue && newValue.forEach(input => cmp.inputs.add(input));
            },
        },
        babylonCMP: {
            setter: (oldValue, newValue, node, cmp, { canvas, engine, scene }) => {
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
                }
            },
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.FreeCamera(node.name, new BABYLON.Vector3(...node.position), scene);
        cmp.inputs.clear();

        propsSetters.defaultTarget.setter(
            node.defaultTarget,
            node.defaultTarget || null,
            node,
            cmp
        );

        propsSetters.inputs.setter(null, node.inputs, node, cmp);

        return cmp;
    },
};

const SphereDefinitions = {
    tagName: 'sphere',
    props: {
        parent: { createIfNotExists: true },
        diameter: { recreate: true },
        subdivisions: { recreate: true },
        position: {
            setter: (oldValue, newValue, node, cmp) => {
                cmp.position = new BABYLON.Vector3(...newValue);
            },
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = BABYLON.Mesh.CreateSphere(node.name, node.subdivisions, node.diameter, scene);
        propsSetters.position.setter(node.position, node.position, node, cmp);

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};

const GroundDefinitions = {
    tagName: 'ground',
    props: {
        parent: { createIfNotExists: true },
        width: { recreate: true },
        height: { recreate: true },
        material: {
            setter: (oldValue, newValue, node, cmp) => (cmp.material = newValue),
        },
        subdivisions: { recreate: true },
        position: {
            setter: (oldValue, newValue, node, cmp) =>
                (cmp.position = new BABYLON.Vector3(...newValue)),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = BABYLON.Mesh.CreateGround(
            node.name,
            node.width,
            node.height,
            node.subdivisions,
            scene
        );

        propsSetters.material.setter(node.material, node.material, node, cmp);
        propsSetters.position.setter(node.position, node.position, node, cmp);

        // if (cmp instanceof BABYLON.Mesh) {
        //     node.children.forEach(child => {
        //         if (child.babylonCMP && child.babylonCMP instanceof BABYLON.Mesh) {
        //             child.babylonCMP.parent = cmp;
        //         }
        //     });
        // }

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};

const ShaderMaterialDefinitions = {
    tagName: 'shaderMaterial',
    props: {
        parent: { createIfNotExists: true },
        shaderPath: { recreate: true },
        attributes: {
            recreate: true,
            transform: value => Array.from(value),
        },
        uniforms: {
            recreate: true,
            transform: value => Array.from(value),
        },
        textureSampler: {
            setter: (oldValue, newValue, node, cmp) => cmp.setTexture('textureSampler', newValue),
        },
        tileTex: {
            setter: (oldValue, newValue, node, cmp) => cmp.setTexture('tileTex', newValue),
        },
        width: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('width', newValue),
        },
        height: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('height', newValue),
        },
        boxSize: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('boxSize', newValue),
        },
        edgeColor: {
            setter: (oldValue, newValue, node, cmp) =>
                cmp.setVector4('edgeColor', new BABYLON.Vector4(...newValue)),
        },
        boxColor: {
            setter: (oldValue, newValue, node, cmp) =>
                cmp.setVector4('boxColor', new BABYLON.Vector4(...newValue)),
        },
        rotateTex: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('boxColor', newValue),
        },
        hue: {
            setter: (oldValue, newValue, node, cmp) =>
                cmp.setVector4('hue', new BABYLON.Vector4(...newValue)),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.ShaderMaterial(node.name, scene, node.shaderPath, {
            attributes: Array.from(node.attributes),
            uniforms: Array.from(node.uniforms),
        });

        // TODO: auto set props
        propsSetters.edgeColor.setter(node.edgeColor, node.edgeColor, node, cmp);

        if (node.hue) {
            propsSetters.hue.setter(node.hue, node.hue, node, cmp);
        }

        propsSetters.boxSize.setter(node.boxSize, node.boxSize, node, cmp);
        propsSetters.width.setter(node.width, node.width, node, cmp);
        propsSetters.height.setter(node.height, node.height, node, cmp);

        if (node.tileTex) {
            propsSetters.tileTex.setter(node.tileTex, node.tileTex, node, cmp);
        }

        if (node.textureSampler) {
            propsSetters.textureSampler.setter(node.textureSampler, node.textureSampler, node, cmp);
        }

        return cmp;
    },
};

const TextureDefinitions = {
    tagName: 'texture',
    props: {
        parent: { createIfNotExists: true },
        url: { recreate: true },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.Texture(node.url, scene);

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};

const BoxDefinitions = {
    tagName: 'box',
    props: {
        parent: { createIfNotExists: true },
        size: { recreate: true },
        options: { recreate: true, transform: value => Object.assign({}, value) },
        position: {
            setter: (oldValue, newValue, node, cmp, { scene }) => {
                if (newValue.start && newValue.end) {
                    const step = 60;
                    const y = (newValue.end[1] - newValue.start[1]) / step;

                    Rx.Observable
                        .interval(1000 / 60, Rx.Scheduler.queue)
                        .skip(1)
                        .take(step)
                        .subscribe(
                            i => {
                                cmp.position = new BABYLON.Vector3(
                                    newValue.end[0],
                                    y * i,
                                    newValue.end[2]
                                );
                            },
                            () => new BABYLON.Vector3(...newValue.end),
                            () => new BABYLON.Vector3(...newValue.end)
                        );
                } else {
                    cmp.position = new BABYLON.Vector3(...newValue);
                }
            },
        },
        material: {
            setter: (oldValue, newValue, node, cmp) => (cmp.material = newValue),
        },
        infiniteDistance: {
            setter: (oldValue, newValue, node, cmp) => (cmp.infiniteDistance = newValue),
        },
        ellipsoid: {
            setter: (oldValue, newValue, node, cmp) =>
                (cmp.ellipsoid = new BABYLON.Vector3(...newValue)),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = node.options
            ? BABYLON.MeshBuilder.CreateBox(node.name, Object.assign({}, node.options), scene)
            : new BABYLON.Mesh.CreateBox(node.name, node.size, scene);

        // TODO: auto set props
        if (node.infiniteDistance)
            propsSetters.infiniteDistance.setter(
                node.infiniteDistance,
                node.infiniteDistance,
                node,
                cmp
            );

        if (node.position) {
            propsSetters.position.setter(node.position, node.position, node, cmp, { scene });
        }

        if (node.ellipsoid) {
            propsSetters.ellipsoid.setter(node.ellipsoid, node.ellipsoid, node, cmp);
        }

        if (node.material) {
            propsSetters.material.setter(node.material, node.material, node, cmp);
        }

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};

const StandardMaterialDefinitions = {
    tagName: 'standardMaterial',
    props: {
        parent: { createIfNotExists: true },
        name: { recreate: true },
        backFaceCulling: {
            setter: (oldValue, newValue, node, cmp) => (cmp.backFaceCulling = newValue),
        },
        reflectionTexture: {
            setter: (oldValue, newValue, node, cmp) => (cmp.reflectionTexture = newValue),
        },
        diffuseColor: {
            setter: (oldValue, newValue, node, cmp) =>
                (cmp.diffuseColor = new BABYLON.Color3(...newValue)),
        },
        specularColor: {
            setter: (oldValue, newValue, node, cmp) =>
                (cmp.specularColor = new BABYLON.Color3(...newValue)),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.StandardMaterial(node.name, scene);

        propsSetters.backFaceCulling.setter(node.backFaceCulling, node.backFaceCulling, node, cmp);

        propsSetters.reflectionTexture.setter(
            node.reflectionTexture,
            node.reflectionTexture,
            node,
            cmp
        );

        propsSetters.diffuseColor.setter(node.diffuseColor, node.diffuseColor, node, cmp);

        propsSetters.specularColor.setter(node.specularColor, node.specularColor, node, cmp);

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};

const CubeTextureDefinitions = {
    tagName: 'cubeTexture',
    props: {
        parent: { createIfNotExists: true },
        url: { recreate: true },
        coordinatesMode: {
            setter: (oldValue, newValue, node, cmp) => (cmp.coordinatesMode = newValue),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.CubeTexture(node.url, scene);

        propsSetters.coordinatesMode.setter(node.coordinatesMode, node.coordinatesMode, node, cmp);

        // TODO: dependency fix
        node.parent[node.parentPropName] = cmp;
        return cmp;
    },
};

const allDefs = [
    HemisphericLightDefinitions,
    FreeCameraDefinitions,
    SphereDefinitions,
    GroundDefinitions,
    ShaderMaterialDefinitions,
    TextureDefinitions,
    BoxDefinitions,
    StandardMaterialDefinitions,
    CubeTextureDefinitions,
    ParentPropDefinitions,
    ParentPropListDefinitions,
    fxaaPostProcessDefinitions,
    defaultCameraMouseZoomInputDefinitions,
    defaultCameraKeyboardMoveInputDefinitions,
    parentDefinitions,
];

const createNodes = defs =>
    defs.reduce(
        (all, def) =>
            Object.assign(all, {
                [def.tagName]: (canvas, engine, scene) => {
                    const NodeClass = def.nodeClass || NodeBabylon;
                    const node = new NodeClass(def.tagName, engine, scene);

                    const createBabylonComponent = def.creator(
                        def.props,
                        canvas,
                        engine,
                        scene,
                        node
                    );

                    node.createBabylonComponent = () => {
                        return createBabylonComponent();
                    };

                    Object.defineProperty(node, 'babylonCMP', {
                        set: function(newValue) {
                            const oldValue = this._babylonCMP;

                            if (oldValue != newValue) {
                                if (oldValue) {
                                    const oldParent = oldValue.parent;
                                    if (newValue) {
                                        newValue.parent = oldParent;
                                    }
                                }
                            }

                            this._babylonCMP = newValue;
                            if (def.props.babylonCMP && def.props.babylonCMP.setter) {
                                def.props.babylonCMP.setter(oldValue, newValue, node, newValue, {
                                    canvas,
                                    engine,
                                    scene,
                                });
                            }
                            if (oldValue) {
                                oldValue.dispose(true);
                            }
                        },
                        get: function() {
                            return this._babylonCMP;
                        },
                    });

                    for (let prop in def.props) {
                        if (prop !== 'babylonCMP') {
                            createProp(node, prop, def.props[prop], { canvas, engine, scene });
                        }
                    }

                    return node;
                },
            }),
        { scene: (canvas, engine, scene) => new Node('scene', engine, scene) }
    );

module.exports = {
    allDefs,
    createNodes,
    Node,
    Scene,
    FreeCamera,
    HemisphericLight,
    Sphere,
    Ground,
    ShaderMaterial,
    Texture,
    Box,
    StandardMaterial,
    CubeTexture,
    hooks: _hooks,
};
