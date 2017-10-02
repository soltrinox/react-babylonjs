// const defs = require('./defs');

// const { allDefs, createNodes } = require('./def');
// const nodeTypes = createNodes(allDefs);
const snabbdom = require('snabbdom');
const snabbdomProps = require('snabbdom/modules/props');

const createBabylonSceneAPI = ({ BABYLON, canvas, engine, scene } = {}) => {
    if (!BABYLON || !canvas || !engine || !scene) {
        throw new Error(
            'Invalid paramaters, you need to provide a single parameter:\n{BABYLON, canvas, engine, scene}'
        );
    }

    const createElement = tagName => {
        const fn = nodeTypes[tagName];
        if (!fn) {
            throw new Error(`<${tagName}> has not a creator function`);
        }
        return fn(canvas, engine, scene);
    };

    const createElementNS = (ns, tagName) => nodeTypes[tagName](canvas, engine, scene);

    const appendChild = (node, child) => node.addChild(child);

    const removeChild = (node, child) => node.removeChild(child);

    const insertBefore = (parentNode, newNode, referenceNode) => {
        if (referenceNode) {
            const i = parentNode.getChildIndex(referenceNode);
            parentNode.addChildAt(newNode, i);
        } else {
            parentNode.addChild(newNode);
        }
    };

    const parentNode = node => node.parent;

    const nextSibling = node => {
        const parent = node.parent;
        const i = parent.getChildIndex(node);
        const sublingIndex = i + 1;

        if (parent.children.length <= sublingIndex) {
            return null;
        }

        return parent.getChildAt(sublingIndex);
    };

    const tagName = node => node.tagName;

    const babylonAPI = {
        createElement,
        createElementNS,
        appendChild,
        removeChild,
        insertBefore,
        parentNode,
        nextSibling,
        tagName,
    };

    Object.defineProperty(babylonAPI, 'scene', {
        get: () => scene,
    });

    Object.defineProperty(babylonAPI, 'canvas', {
        get: () => canvas,
    });

    Object.defineProperty(babylonAPI, 'engine', {
        get: () => engine,
    });

    const patch = snabbdom.init([snabbdomProps.propsModule], babylonAPI);

    return Object.assign({ patch }, babylonAPI);
};

module.exports = { createBabylonSceneAPI };
