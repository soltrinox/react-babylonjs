/*const _bindEvents = (rootContext, hostContext, cmp, newProps, oldProps) => {
    const { BABYLON, scene } = hostContext;
    // cmp.actionManager && cmp.actionManager.dispose();
    const __EVENTS = {
        pickTrigger: BABYLON.ActionManager.OnPickTrigger,
    };

    const actions = Object.keys(newProps.on || {})
        .map(eventName => ({
            type: __EVENTS[eventName],
            handler: newProps.on[eventName],
        }))
        .filter(({ type }) => type)
        .map(
            ({ type, handler }) => new BABYLON.ExecuteCodeAction(type, handler)
        );

    if (actions.length > 0) {
        cmp.actionManager = new BABYLON.ActionManager(scene);
        actions.forEach(action => cmp.actionManager.registerAction(action));
    }
};*/
