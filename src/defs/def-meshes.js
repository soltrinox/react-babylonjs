const BABYLON = require('babylonjs');

const sphere = {
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

const ground = {
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

        if (cmp instanceof BABYLON.Mesh) {
            node.children.forEach(child => {
                if (child.babylonCMP && child.babylonCMP instanceof BABYLON.Mesh) {
                    child.babylonCMP.parent = cmp;
                }
            });
        }

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};
const box = {
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

module.exports = [sphere, ground, box];
