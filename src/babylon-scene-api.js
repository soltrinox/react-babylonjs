const components = require('./node-components');
const snabbdom = require('snabbdom');
const snabbdomProps = require('./snabbdom-props').default;
const nodes = require('./node-components');
const helpers = require('./helpers');
const { Node } = require('./node');

class ErrorInvalidChildrenType extends Error {
    constructor() {
        super('The components children can either be an array or null.');
    }
}

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
            throw new ErrorInvalidChildrenType();
        },
    };
    const patch = snabbdom.init([snabbdomProps], babylonAPI);
    const extraKeys = { patch, canvas, scene, engine };

    const handler = {
        get(target, key) {
            if (extraKeys[key]) {
                return extraKeys[key];
            }

            return target[key];
        },

        set(target, key, value) {
            return false;
        },

        has(target, key) {
            if (extraKeys[key]) {
                return true;
            }
            return key in target;
        },

        ownKeys: target => Reflect.ownKeys(target).concat(Object.keys(extraKeys)),

        getPrototypeOf: () => Object.prototype,
    };

    return new Proxy(babylonAPI, handler);
};

module.exports = { createBabylonSceneAPI, ErrorInvalidChildrenType };
