
const Store = () => {
    const _subscribers = {};
    let _lastId = 0;
    let state = { currentView: 1 };

    const notify = cb => cb(state);
    const broadcast = newState =>
        Object.entries(_subscribers).forEach(([id, cb]) => cb(newState));
    const getState = () => state;
    const setState = newState => {
        state = newState;
        broadcast(newState);
    };
    const subscribe = cb => {
        const id = ++_lastId;
        _subscribers[id] = cb;
        notify(cb);
        return function unsubscribe() {
            delete _subscribers[id];
        };
    };
    const selectView = currentView =>
        setState(Object.assign({}, getState(), { currentView }));

    return {
        getState,
        setState,
        subscribe,
        actions: {
            selectView,
        },
    };
};

module.exports = Store;