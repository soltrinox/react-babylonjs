const _defaultProps = {
    ActionManager: { OnPickTrigger: "OnPickTrigger-12" },
};
const createClasseByType = (type, sandbox) =>
    sandbox.spy(function(...args) {
        return { type, args };
    });

const createClasses = (types, sandbox) =>
    types.reduce(
        (all, type) => {
            const mySymbol = Symbol(type);
            const myClass = createClasseByType(mySymbol, sandbox);

            Object.assign(all.classesByType, _defaultProps[type]);

            Object.assign(all.classesByType, {
                [type]: myClass,
            });

            Object.assign(all.classesBySymbol, {
                [mySymbol]: myClass,
            });

            Object.assign(all.symbolByType, {
                [type]: mySymbol,
            });

            return all;
        },
        { classesBySymbol: {}, classesByType: {}, symbolByType: {} }
    );

const setStaticMethods = (sandbox, classes) => {
    classes.Mesh.CreateSphere = classes.Sphere;
};

const _babylonTypes = [
    "Mesh",
    "Sphere",
    "Vector3",
    "HemisphericLight",
    "FreeCamera",
    "ShaderMaterial",
    "ActionManager",
    "ExecuteCodeAction",
];

const create = sandbox => {
    const { symbolByType, classesByType } = createClasses(
        _babylonTypes,
        sandbox
    );

    setStaticMethods(sandbox, classesByType);

    const BABYLON = Object.assign({}, classesByType);

    const scene = Symbol({
        description: "i-m-the-scene",
    });

    const context = { BABYLON, scene };

    return {
        BABYLON,
        scene,
        context,
        symbolByType,
    };
};

module.exports = { create };
