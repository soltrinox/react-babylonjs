const { Node } = require('../node');

const parentPropList = {
    tagName: 'parentPropList',
    props: {
        parent: { createIfNotExists: true },
    },
    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        const cmps = node.children.map(child => child.babylonCMP);

        cmps.forEach(cmp => node.parent[node.name].push(cmp));

        return {
            dispose: () => cmps.forEach(cmp => node.parent[node.name].remove(cmp)),
        };
    },
    nodeClass: Node,
};

const parentProp = {
    tagName: 'parentProp',
    props: {
        parent: { createIfNotExists: true },
    },
    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
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

const parent = {
    tagName: 'parent',
    props: {
        parent: { createIfNotExists: true, recreate: true, everySet: true },
    },
    creator: (propsSetters, { BABYLON, canvas, engine, scene }, node) => () => {
        node.children.forEach(child => (child[node.name] = node.parent));

        return { dispose: () => node.children.forEach(child => (child[node.name] = null)) };
    },
    nodeClass: Node,
};

module.exports = [parentPropList, parentProp, parent];
