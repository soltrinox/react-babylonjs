const hemisphericLight = {
    tagName: 'hemisphericLight',
    props: {
        parent: { createIfNotExists: true },
        intensity: {
            setter: (oldValue, newValue, node, cmp) => {
                cmp.intensity = newValue;
            },
        },
    },
    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        const cmp = new BABYLON.HemisphericLight(
            node.name,
            new BABYLON.Vector3(...node.target),
            scene
        );
        propsSetters.intensity.setter(node.intensity, node.intensity, node, cmp);
        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }
        return cmp;
    },
};

module.exports = [hemisphericLight];
