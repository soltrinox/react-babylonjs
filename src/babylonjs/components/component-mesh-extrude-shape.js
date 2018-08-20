const disposers = require("../helpers/property-disposers");
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

    const component = BABYLON.MeshBuilder.ExtrudeShape(
        values.name,
        opts,
        scene
    );
    return component;
};

const props = {
    shape: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.vector3),
    },
    path: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.vector3),
    },
    scale: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    cap: {
        newComponentRequired: true,
        transformer: transformers.byPass,
        // TODO: enum type
        /*
        transformers.enum(({ BABYLON }) => [
            BABYLON.Mesh.NO_CAP,
            BABYLON.Mesh.CAP_START,
            BABYLON.Mesh.CAP_END,
            BABYLON.Mesh.CAP_ALL,
        ]) */
    },
    sideOrientation: {
        newComponentRequired: true,
        transformer: transformers.byPass,
        /*
        // TODO: enum type
        transformers.enum(
            BABYLON.Mesh.DOUBLESIDE,
            BABYLON.Mesh.DEFAULTSIDE
        ),
        */
    },
    frontUVs: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.vector4),
    },
    backUVs: {
        newComponentRequired: true,
        transformer: transformers.vector4,
    },
    invertUV: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    // TODO:
    // instance:{}
    material: {
        setter: setters.propertyFromComponent("material"),
        transformer: transformers.component,
        dispose: disposers.component,
    },
};

const extrudeShape = {
    superTypes: ["mesh"],
    type: "extrudeShape",
    createComponent,
    props,
};
module.exports = extrudeShape;
