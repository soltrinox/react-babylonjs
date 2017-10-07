const components = require('./node-components');
const snabbdom = require('snabbdom');
const snabbdomProps = require('snabbdom/modules/props');
const nodes = require('./node-components');
const helpers = require('./helpers');
const { Node } = require('./node');

const createBabylonSceneAPI = (context = {}) => {
    const { BABYLON, canvas, engine, scene } = context;
    if (!BABYLON || !canvas || !engine || !scene) {
        throw new Error(
            'Invalid paramaters, you need to provide a single parameter:\n{BABYLON, canvas, engine, scene}'
        );
    }
    const _nodeTypes = helpers.componentToNodes(nodes);

    const createElement = tagName => {
        const fn = _nodeTypes[tagName];
        if (!fn) {
            throw new Error(`<${tagName}> has not a creator function`);
        }
        return fn(context);
    };

    const createRootElement = () => {
        const parentContainer = new Node('app');
        const container = new Node('root');
        parentContainer.addChild(container);
        return container;
    };

    const createElementNS = (ns, tagName) => _nodeTypes[tagName](context);

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
        createRootElement,
        createElement,
        createElementNS,
        appendChild,
        removeChild,
        insertBefore,
        parentNode,
        nextSibling,
        tagName,
        createTextNode: (...args) => {
            throw new Error(...args);
        },
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
