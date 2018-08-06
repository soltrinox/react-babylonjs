const vector3 = ({ BABYLON }, value) => new BABYLON.Vector3(...value);
const vector4 = ({ BABYLON }, value) => new BABYLON.Vector4(...value);
const color4 = ({ BABYLON }, value) => new BABYLON.Color4(...value);
const color3 = ({ BABYLON }, value) => new BABYLON.Color3(...value);
const byPass = (_, value) => value;
// TODO: validate
// const _enum = () => (_, value) => value;
// TODO: include size
const arrayOf = transformer => (context, value) =>
    value.map(v => transformer(context, v));

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
    // enum: _enum,
    byPass,
    arrayOf,
    color3,
    color4,
    vector3,
    vector4,
    component,
};

module.exports = transformers;
