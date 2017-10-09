const scene = {
    tagName: 'scene',
    props: {
        clearColor: {
            setter: (oldValue, newValue, node, cmp, { BABYLON }) =>
                (cmp.clearColor = BABYLON.Vector3(...newValue)),
        },
    },

    creator: (propsSetters, context, node) => () => {
        const { scene } = context;
        const cmp = scene;

        if (node.clearColor) {
            propsSetters.clearColor.setter(node.clearColor, node.clearColor, node, cmp, context);
        }

        return cmp;
    },
};

module.exports = [scene];
