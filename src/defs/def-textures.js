const BABYLON = require('babylonjs');

const texture = {
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

const cubeTexture = {
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

module.exports = [texture, cubeTexture];
