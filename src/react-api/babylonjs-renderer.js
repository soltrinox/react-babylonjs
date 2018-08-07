// 1. evetns
// 1.1 warning message event doesn't exist
// 1.2 not recreate the component if the handler hasn't changed
// 2. compose properties
// 3. re-creatiing babylon component?
// 3.1 as it for now just throws an Error

// const babylonjsFactoryComponent = require("./babylonjs-factory-component");
// const Node = require("./node");

class ErrorNotImplemented extends Error {}
const _noop = () => () => {};
const _notImplemented = name => () => {
    throw new ErrorNotImplemented(name);
};
const DEBUGGER = (
    fn,
    // eslint-disable-next-line no-unused-vars
    name
) => (...args) => {
    return fn(...args);
};

const getPublicInstance = instance => instance;
const getRootHostContext = container => container.props;
const getChildHostContext = (
    parentContext,
    type /* : string */,
    rootContainer
) => Object.assign({}, parentContext, { type, rootContainer });

const createInstance = ({ /*logger,*/ Node }) =>
    DEBUGGER((
        type /* : string */,
        props /* : Props */,
        rootContainerInstance /* : Container */,
        hostContext /* : {} */,
        // eslint-disable-next-line no-unused-vars
        internalInstanceHandle /* : Instance */ /* : Object */
    ) => {
        const node = new Node(type);

        if (rootContainerInstance.props.elements.byType[type]) {
            node.cmp = rootContainerInstance.props.elements.byType[type](
                hostContext,
                props
            );
        }

        return node;
    }, "createInstance");

const appendChild = DEBUGGER(
    (
        parentInstance /* : Instance  | Container*/,
        child /* : void */ /* : Instance | TextInstance */
    ) => parentInstance.appendChild(child),
    "appendChild"
);

const removeChild = DEBUGGER((
    parentInstance /* : Instance */,
    child /* : Instance  | TextInstance*/ /* : void */
) => {
    return parentInstance.removeChild(child);
}, "removeChild");

const commitUpdate = DEBUGGER((
    instance /* : Instance */,
    updatePayload /* : Object */,
    type /* : string */,
    oldProps /* : Props */,
    newProps /* : Props */,
    // eslint-disable-next-line no-unused-vars
    internalInstanceHandle /* : Object */
) => /* : void */ {
    instance.cmp.updateProps(updatePayload);
}, "commitUpdate");

// shouldn't matter, 'cause it's adding the scene to the root
const appendChildToContainer = DEBUGGER((
    parentInstance /* : Container */,
    // eslint-disable-next-line no-unused-vars
    child /* : void */ /* : Instance | TextInstance*/
) => {
    return parentInstance.appendChild(child);
}, "appendChildToContainer");

const removeChildFromContainer = DEBUGGER((
    parentInstance /* : Container */,
    // eslint-disable-next-line no-unused-vars
    child /* : Instance  | TextInstance*/ /* : void */
) => {
    return parentInstance.removeChild(child);
}, "removeChildFromContainer");

const insertBefore = DEBUGGER((
    parentInstance /* : Instance */,
    child /* : Instance | TextInstance*/,
    // eslint-disable-next-line no-unused-vars
    beforeChild /* : Instance | TextInstance*/ /* : void */
) => {
    // noop
}, "insertBefore");

const Mutation = (/*{ logger }*/) => ({
    appendChild,
    removeChild,
    commitMount(
        instance /* : Instance */,
        type /* : string */,
        newProps /* : Props */,
        // eslint-disable-next-line no-unused-vars
        internalInstanceHandle /* : Object */
    ) /* : void */ {
    },
    commitUpdate,
    appendChildToContainer,
    insertBefore,
    insertInContainerBefore(
        parentInstance /* : Container */,
        child /* : Instance  | TextInstance*/,
        // eslint-disable-next-line no-unused-vars
        beforeChild /* : Instance | TextInstance*/
    ) /* : void */ {
    },
    removeChildFromContainer,
});

const BabylonJSRenderer = opts => ({
    supportsMutation: true,
    now: () => Date.now(),
    useSyncScheduling: true,
    mutation: Mutation(opts),
    getRootHostContext,
    getPublicInstance,
    createInstance: createInstance(opts),
    getChildHostContext,
    commitUpdate,
    appendChild,
    removeChild,
    appendChildToContainer,
    commitMount() {},
    removeChildFromContainer,
    insertBefore,
    // at this stage all children were created and already had the `finalizeInitialChildren` executed
    // 1. when a component's created it's possible to set some default values
    // 2. also some actions, such as setting focus
    // 3. if it returns true, eventually it will trigger a commitMount
    // 4. another thing(if not the most important) you should set the properties in your component
    finalizeInitialChildren(
        instance /* : Instance */,
        type /* : string */,
        props /* : Props */,
        // eslint-disable-next-line no-unused-vars
        rootContainerInstance /* : Container */
    ) /* : boolean */ {
        return true;
    },
    appendInitialChild: appendChild,

    // decides if there is any update to be done
    // if there is no change to apply, then just returns null
    // otherwise to make your life easier, calculate what needs to be changed and return it
    // it's result will be passed to `mutation.commitUpdate` as `updatePayload` (2nd parameter)
    prepareUpdate(
        instance /* : Instance */,
        type /* : string */,
        oldProps /* : Props */,
        newProps /* : Props */,
        rootContainerInstance /* : Container */,
        // eslint-disable-next-line no-unused-vars
        hostContext /* : {} */
    ) /* : null  | Object*/ {
        // if (arePropsEqual(oldProps, newProps)) {
        //     return newProps;
        // }
        return newProps;
    },
    // **********************************
    // hooks whenever an update happens
    // **********************************
    prepareForCommit: _noop("prepareForCommit"),
    resetAfterCommit: _noop("resetAfterCommit"),

    // **********************************
    // as it doesn't support pure text content....
    // **********************************
    // eslint-disable-next-line no-unused-vars
    shouldSetTextContent(
        type /* : string */,
        // eslint-disable-next-line no-unused-vars
        props /* : Props*/
    ) /*:  boolean*/ {
        return false;
    },
    // eslint-disable-next-line no-unused-vars
    resetTextContent: _notImplemented("resetTextContent"),
    // (instance /* : Instance*/) /*:  void*/ {
    //     throw new ErrorNotImplemented();
    // },

    createTextInstance: _notImplemented("createTextInstance"),
    // (
    //     text,
    //     rootContainerInstance,
    //     hostContext,
    //     // eslint-disable-next-line no-unused-vars
    //     internalInstanceHandle
    // ) {
    //     throw new ErrorNotImplemented();
    // },

    commitTextUpdate: _notImplemented("commitTextUpdate"),
    // (
    //     textInstance /* : TextInstance */,
    //     oldText /* : string */,
    //     // eslint-disable-next-line no-unused-vars
    //     newText /* : string */
    // ) /* : void */ {
    //     throw new ErrorNotImplemented();
    // },
    // **********************************
    // **********************************
});

module.exports = BabylonJSRenderer;

// // eslint-disable-next-line no-unused-vars
// function processProps(
//     instance /* : number */,
//     props /* : Props*/
// ) /*:  Object*/ {
//     const propsPayload = {};
//     for (let key in props) {
//         if (key === "children") {
//             // Skip special case.
//             continue;
//         }
//         let value = props[key];
//         if (typeof value === "function") {
//             value = {
//                 style: "rt-event",
//                 event: key,
//                 tag: instance,
//             };
//         }
//         propsPayload[key] = value;
//     }
//     return propsPayload;
// }

// // eslint-disable-next-line no-unused-vars
// function arePropsEqual(
//     oldProps /* : Props */,
//     newProps /* : Props*/
// ) /*:  boolean*/ {
//     for (let key in newProps) {
//         if (key === "children") {
//             // Skip special case.
//             continue;
//         }

//         if (newProps[key] !== oldProps[key]) {
//             return false;
//         }
//     }

//     for (let key in oldProps) {
//         if (key === "children") {
//             // Skip special case.
//             continue;
//         }
//         if (!(key in newProps)) {
//             return false;
//         }
//     }
//     return true;
// }
