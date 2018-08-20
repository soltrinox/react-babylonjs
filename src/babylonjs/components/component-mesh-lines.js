const setters = require("../helpers/property-setters");
const transformers = require("../helpers/property-transformers");
const { fromPairs } = require("../helpers/functional");

// TODO: improve performance
const getOpts = (context, values) =>
    fromPairs(
        Object.keys(values)
            .map(key => ({ def: props[key], value: values[key], key }))
            .filter(
                ({ def }) => def && def.newComponentRequired && def.transformer
            )
            .map(({ def, value, key }) => [
                key,
                def.transformer(context, value),
            ])
    );

const createComponent = (context, values) => {
    const { BABYLON, scene } = context;
    const opts = getOpts(context, values);
    const component = BABYLON.MeshBuilder.CreateLines(values.name, opts, scene);
    return component;
};

const props = {
    points: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.vector3),
    },
    colors: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.color4),
    },
    color: {
        setter: setters.property("color"),
        transformer: transformers.color3,
    },
    useVertexColor: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
};

const sphere = { superTypes: ["mesh"], type: "lines", createComponent, props };
module.exports = sphere;
