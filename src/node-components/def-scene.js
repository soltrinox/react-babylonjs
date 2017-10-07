const scene = {
    tagName: 'scene',
    props: {},

    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        const cmp = scene;
        return cmp;
    },
};

module.exports = [scene];
