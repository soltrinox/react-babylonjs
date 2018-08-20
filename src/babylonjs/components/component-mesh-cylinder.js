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

    const component = BABYLON.MeshBuilder.CreateCylinder(
        values.name,
        opts,
        scene
    );
    return component;
};

const props = {
    height: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    diameterTop: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    diameterBottom: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    tessellation: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    subdivisions: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    arc: {
        newComponentRequired: true,
        transformer: transformers.byPass,
        // transformer: transformers.enum(
        //     BABYLON.Mesh.DOUBLESIDE,
        //     BABYLON.Mesh.DEFAULTSIDE
        // ),
    },
    sideOrientation: {
        newComponentRequired: true,
        transformer: transformers.byPass,
    },
    faceColors: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.color3),
    },
    faceUV: {
        newComponentRequired: true,
        transformer: transformers.arrayOf(transformers.vector4),
    },
    frontUVs: {
        newComponentRequired: true,
        transformer: transformers.vector4,
    },
    backUVs: {
        newComponentRequired: true,
        transformer: transformers.vector4,
    },
    position: {
        setter: setters.property("position"),
        transformer: transformers.vector3,
    },
    rotation: {
        setter: setters.property("rotation"),
        transformer: transformers.vector3,
    },
    material: {
        setter: setters.propertyFromComponent("material"),
        transformer: transformers.component,
        dispose: disposers.component,
    },
};

const sphere = {
    superTypes: ["mesh"],
    type: "cylinder",
    createComponent,
    props,
};
module.exports = sphere;
