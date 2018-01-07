const ComponentManager = () => {
    let _lastId = 0;
    const _cache = {};
    const validateId = componentId => {
        if (!componentId) {
            throw new Error("No id was provided");
        }

        const id = parseInt(componentId);

        if (!id || id > _lastId) {
            throw new Error("Invalid id");
        }
    };

    const newId = () => (++_lastId).toString();
    const save = (componentId, component) => {
        validateId(componentId);
        if (component) {
            _cache[componentId] = component;
        } else {
            delete _cache[componentId];
        }
    };
    const get = componentId => {
        validateId(componentId);
        return _cache[componentId];
    };

    return {
        newId,
        save,
        get,
    };
};

module.exports = { create: ComponentManager };
