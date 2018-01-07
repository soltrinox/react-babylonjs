const vector3 = ({ BABYLON }, value) => new BABYLON.Vector3(...value);
const vector4 = ({ BABYLON }, value) => new BABYLON.Vector4(...value);

const component = (context, value, prevReturned) => {
    if (!value) {
        if (prevReturned) {
            prevReturned.dispose();
        }

        return null;
    }

    const { type, props } = value;

    if (prevReturned) {
        prevReturned.updateProps(props);
        return prevReturned;
    }

    if (!context.elements.byType[type]) {
        context.logger.warn(`element <${type}> not found.`);
        return;
    }

    return context.elements.byType[type](context, props);
};
component.needLastReturned = true;

const transformers = {
    vector3,
    vector4,
    component,
};

module.exports = transformers;
