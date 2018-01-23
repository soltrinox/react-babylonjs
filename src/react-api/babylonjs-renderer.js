// 1. evetns
// 1.1 warning message event doesn't exist
// 1.2 not recreate the component if the handler hasn't changed
// 2. compose properties
// 3. re-creatiing babylon component?
// 3.1 as it for now just throws an Error

// const babylonjsFactoryComponent = require("./babylonjs-factory-component");
class ErrorNotImplemented extends Error {}

// const React = require("react");

const ReactFiberReconciler = require("react-reconciler");

let i = 0;
const buildFiberPath = ({ child, sibling /*,...fiber*/ }) => {
    return [{ child, sibling }];
};

const debug_fiber = ({ return: fiber }) => {
    return { stateNode: fiber.stateNode, type: fiber.type, fiber };
};
const DEBUG = () => {};
const mutation = {
    commitMount(
        instance /* : Instance */,
        type /* : string */,
        newProps /* : Props */,
        internalInstanceHandle /* : Object */
    ) /* : void */ {
        DEBUG(
            "-@@@MUTATION.commitMount",
            type,
            // {
            //     newProps,
            //     instance,
            //     internalInstanceHandle,
            // },
            // ...buildFiberPath(internalInstanceHandle),
            debug_fiber(internalInstanceHandle)
        );
    },

    commitUpdate(
        instance /* : Instance */,
        updatePayload /* : Object */,
        type /* : string */,
        oldProps /* : Props */,
        newProps /* : Props */,
        internalInstanceHandle /* : Object */
    ) /* : void */ {
        DEBUG(
            "+@@@MUTATION.commitUpdate",
            type,
            // {
            //     updatePayload,
            //     oldProps,
            //     newProps,
            //     instance,
            //     internalInstanceHandle,
            // },
            debug_fiber(internalInstanceHandle)
        );

        if (instance.cmp && instance.cmp.updateProps) {
            instance.cmp.updateProps(updatePayload);
            return;
        }

        const { rootContext, hostContext } = updatePayload;
        Object.keys(newProps)
            .filter(key => instance[key] && typeof instance[key] === "function")
            .forEach(propertySetter => {
                instance[propertySetter](
                    rootContext,
                    hostContext,
                    instance.cmp,
                    newProps,
                    oldProps
                );
            });
    },

    appendChild(
        parentInstance /* : Instance  | Container*/,
        child /* : Instance | TextInstance */
    ) /* : void */ {
        DEBUG(
            `+@@@MUTATION.appendChild ${child.type} into => ${parentInstance.type}`,
            {
                parentInstance,
                child,
            }
        );
        parentInstance.addChild(child);
        // if (parentInstance.appendChild) {
        //     parentInstance.appendChild(child);
        // } else {
        //     parentInstance.babylonJSStuff = child;
        // }
    },
    appendChildToContainer(
        parentInstance /* : Container */,
        child /* : Instance | TextInstance*/
    ) /* : void */ {
        DEBUG("-@@@MUTATION.appendChildToContainer", { parentInstance, child });
    },

    insertBefore(
        parentInstance /* : Instance */,
        child /* : Instance | TextInstance*/,
        beforeChild /* : Instance | TextInstance*/
    ) /* : void */ {
        DEBUG("-@@@MUTATION.insertBefore", {
            parentInstance,
            child,
            beforeChild,
        });
        // noop
    },
    insertInContainerBefore(
        parentInstance /* : Container */,
        child /* : Instance  | TextInstance*/,
        // eslint-disable-next-line no-unused-vars
        beforeChild /* : Instance | TextInstance*/
    ) /* : void */ {
        DEBUG("-@@@MUTATION.insertInContainerBefore");
    },

    removeChild(
        parentInstance /* : Instance */,
        child /* : Instance  | TextInstance*/
    ) /* : void */ {
        DEBUG("+@@@MUTATION.removeChild", child);
        parentInstance.removeChild(child);
    },
    removeChildFromContainer(
        parentInstance /* : Container */,
        // eslint-disable-next-line no-unused-vars
        child /* : Instance  | TextInstance*/
    ) /* : void */ {
        DEBUG("-@@@MUTATION.removeChildFromContainer");
    },
};

const BabylonJSRenderer = ReactFiberReconciler({
    mutation,
    useSyncScheduling: true,
    getPublicInstance(instance) {
        DEBUG("@@BabylonJSRenderer.getPublicInstance");
        return instance;
    },
    getRootHostContext(container) {
        DEBUG(
            "BabylonJSRenderer.getRootHostContext",
            container.props,
            container.children
        );
        return Object.assign({ iAmTheHost: true }, container.props);
    },
    getChildHostContext(parentContext, type /* : string */, rootContainer) {
        i++;
        DEBUG(`BabylonJSRenderer.getChildHostContext-${i}}`, {
            parentContext,
            type,
            rootContainer,
        });
        return Object.assign(
            {
                [`childHostContext${i}`]: "childddddd",
            },
            parentContext,
            { type, rootContainer }
        );
    },

    now: () => Date.now(),

    createInstance(
        type /* : string */,
        props /* : Props */,
        rootContainerInstance /* : Container */,
        hostContext /* : {} */,
        internalInstanceHandle /* : Object */
    ) /* : Instance */ {
        DEBUG(
            "BabylonJSRenderer.createInstance",
            {
                type,
                props,
                rootContainerInstance,
                hostContext,
                internalInstanceHandle,
            },
            ...buildFiberPath(internalInstanceHandle)
        );

        const ele = createElement(
            rootContainerInstance,
            hostContext,
            type,
            props
        );

        if (ele.cmp) {
            // ele.dispose = () => DEBUG('************');
            ele.dispose = () => ele.cmp.dispose();
        }
        return ele;
    },

    // at this stage all children were created and already had the `finalizeInitialChildren` executed
    // 1. when a component's created it's possible to set some default values
    // 2. also some actions, such as setting focus
    // 3. if it returns true, eventually it will trigger a commitMount
    // 4. another thing(if not the most important) you should set the properties in your component
    finalizeInitialChildren(
        instance /* : Instance */,
        type /* : string */,
        props /* : Props */,
        rootContainerInstance /* : Container */
    ) /* : boolean */ {
        DEBUG("BabylonJSRenderer.finalizeInitialChildren", {
            type,
            props,
            instance,
            rootContainerInstance,
        });
        return true;
    },
    appendInitialChild(
        parentInstance /* : Instance */,
        child /* : Instance  | TextInstance*/
    ) /* : void */ {
        DEBUG(
            `+BabylonJSRenderer.appendInitialChild ${child.type} into => ${parentInstance.type}`,
            {
                parentInstance,
                child,
            }
        );
        parentInstance.addChild(child);
        // if (parentInstance.appendChild) {
        //     parentInstance.appendChild(child);
        // } else {
        //     parentInstance.babylonJSStuff = child;
        // }
    },

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
        DEBUG("BabylonJSRenderer.prepareUpdate", {
            type,
            instance,
            oldProps,
            newProps,
        });
        // if (arePropsEqual(oldProps, newProps)) {
        //     return newProps;
        // }

        return newProps;
    },
    // **********************************
    // hooks whenever an update happens
    // **********************************
    prepareForCommit() {
        DEBUG("-BabylonJSRenderer.prepareForCommit");
        // noop
    },

    resetAfterCommit() {
        DEBUG("-BabylonJSRenderer.resetAfterCommit");
        // noop
    },

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
    resetTextContent(instance /* : Instance*/) /*:  void*/ {
        throw new ErrorNotImplemented();
    },
    createTextInstance(
        text,
        rootContainerInstance,
        hostContext,
        // eslint-disable-next-line no-unused-vars
        internalInstanceHandle
    ) {
        throw new ErrorNotImplemented();
    },
    commitTextUpdate(
        textInstance /* : TextInstance */,
        oldText /* : string */,
        // eslint-disable-next-line no-unused-vars
        newText /* : string */
    ) /* : void */ {
        throw new ErrorNotImplemented();
    },
    // **********************************
    // **********************************
});

BabylonJSRenderer.injectIntoDevTools({
    bundleType: 0, // 0 for PROD, 1 for DEV
    version: "0.1.0", // version for your renderer
    rendererPackageName: "babylon3d", // package name
});

module.exports = BabylonJSRenderer;

function TmpNode(values) {
    Object.keys(values).forEach(key => (this[key] = values[key]));
    this.children = [];

    this.addChild = function(item) {
        this.children.push(item);
        item.parent = this;
    };

    this.removeChild = function(child) {
        while (child.children.length > 0)
            child.removeChild(child.children[child.children.length - 1]);

        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
        if (child.dispose) {
            child.dispose();
        }
    };

    this.dispose = function() {
        if (this.cmp && this.cmp.dispose) {
            this.cmp.dispose();
        }
    };
}

function createElement(rootContext, parentContext, type, props) {
    const ele = new TmpNode({ type, props });

    if (rootContext.props.elements.byType[type]) {
        ele.cmp = rootContext.props.elements.byType[type](parentContext, props);
        return ele;
    }

    return ele;
}

// eslint-disable-next-line no-unused-vars
function processProps(
    instance /* : number */,
    props /* : Props*/
) /*:  Object*/ {
    const propsPayload = {};
    for (let key in props) {
        if (key === "children") {
            // Skip special case.
            continue;
        }
        let value = props[key];
        if (typeof value === "function") {
            value = {
                style: "rt-event",
                event: key,
                tag: instance,
            };
        }
        propsPayload[key] = value;
    }
    return propsPayload;
}

// eslint-disable-next-line no-unused-vars
function arePropsEqual(
    oldProps /* : Props */,
    newProps /* : Props*/
) /*:  boolean*/ {
    for (let key in newProps) {
        if (key === "children") {
            // Skip special case.
            continue;
        }

        if (newProps[key] !== oldProps[key]) {
            return false;
        }
    }

    for (let key in oldProps) {
        if (key === "children") {
            // Skip special case.
            continue;
        }
        if (!(key in newProps)) {
            return false;
        }
    }
    return true;
}
