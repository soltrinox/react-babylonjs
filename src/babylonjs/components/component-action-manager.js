const createComponent = ({ BABYLON, scene }) => {
    const component = new BABYLON.ActionManager(scene);
    return component;
};
const setter = () => (component, { action, toRemove }) => {
    if (toRemove) {
        component.unregisterAction(action);
        return;
    }
    if (component.actions.indexOf(action) === -1) {
        component.registerAction(action);
    }
};
const transformer = prop => {
    const cb = ({ BABYLON }, value, prevReturned) => {
        const action =
            (prevReturned && prevReturned.action
                ? prevReturned.action
                : null) ||
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager[prop], value);
        action.func = value;
        return { action, toRemove: typeof value !== "function" };
    };
    cb.needLastReturned = true;
    return cb;
};

const props = [
    "OnPickTrigger",
    "OnLeftPickTrigger",
    "OnRightPickTrigger",
    "OnCenterPickTrigger",
    "OnPickDownTrigger",
    "OnDoublePickTrigger",
    "OnPickUpTrigger",
    "OnPickOutTrigger",
    "OnLongPressTrigger",
    "OnPointerOverTrigger",
    "OnPointerOutTrigger",
    "OnEveryFrameTrigger",
    "OnIntersectionEnterTrigger",
    "OnIntersectionExitTrigger",
    "OnKeyDownTrigger",
    "OnKeyUpTrigger",
].reduce(
    (acc, prop) =>
        Object.assign(acc, {
            [prop]: {
                setter: setter(prop),
                transformer: transformer(prop),
            },
        }),
    {}
);

const actionManager = { type: "actionManager", createComponent, props };
module.exports = actionManager;
