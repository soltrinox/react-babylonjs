const BABYLON = require('babylonjs');

const StandardMaterialDefinitions = {
    tagName: 'standardMaterial',
    props: {
        parent: { createIfNotExists: true },
        name: { recreate: true },
        backFaceCulling: {
            setter: (oldValue, newValue, node, cmp) => (cmp.backFaceCulling = newValue),
        },
        reflectionTexture: {
            setter: (oldValue, newValue, node, cmp) => (cmp.reflectionTexture = newValue),
        },
        diffuseColor: {
            setter: (oldValue, newValue, node, cmp) =>
                (cmp.diffuseColor = new BABYLON.Color3(...newValue)),
        },
        specularColor: {
            setter: (oldValue, newValue, node, cmp) =>
                (cmp.specularColor = new BABYLON.Color3(...newValue)),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.StandardMaterial(node.name, scene);

        propsSetters.backFaceCulling.setter(node.backFaceCulling, node.backFaceCulling, node, cmp);

        propsSetters.reflectionTexture.setter(
            node.reflectionTexture,
            node.reflectionTexture,
            node,
            cmp
        );

        propsSetters.diffuseColor.setter(node.diffuseColor, node.diffuseColor, node, cmp);

        propsSetters.specularColor.setter(node.specularColor, node.specularColor, node, cmp);

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }

        return cmp;
    },
};
const ShaderMaterialDefinitions = {
    tagName: 'shaderMaterial',
    props: {
        parent: { createIfNotExists: true },
        shaderPath: { recreate: true },
        attributes: {
            recreate: true,
            transform: value => Array.from(value),
        },
        uniforms: {
            recreate: true,
            transform: value => Array.from(value),
        },
        textureSampler: {
            setter: (oldValue, newValue, node, cmp) => cmp.setTexture('textureSampler', newValue),
        },
        tileTex: {
            setter: (oldValue, newValue, node, cmp) => cmp.setTexture('tileTex', newValue),
        },
        width: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('width', newValue),
        },
        height: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('height', newValue),
        },
        boxSize: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('boxSize', newValue),
        },
        edgeColor: {
            setter: (oldValue, newValue, node, cmp) =>
                cmp.setVector4('edgeColor', new BABYLON.Vector4(...newValue)),
        },
        boxColor: {
            setter: (oldValue, newValue, node, cmp) =>
                cmp.setVector4('boxColor', new BABYLON.Vector4(...newValue)),
        },
        rotateTex: {
            setter: (oldValue, newValue, node, cmp) => cmp.setFloat('boxColor', newValue),
        },
        hue: {
            setter: (oldValue, newValue, node, cmp) =>
                cmp.setVector4('hue', new BABYLON.Vector4(...newValue)),
        },
    },
    creator: (propsSetters, canvas, engine, scene, node) => () => {
        const cmp = new BABYLON.ShaderMaterial(node.name, scene, node.shaderPath, {
            attributes: Array.from(node.attributes),
            uniforms: Array.from(node.uniforms),
        });

        // TODO: auto set props
        propsSetters.edgeColor.setter(node.edgeColor, node.edgeColor, node, cmp);

        if (node.hue) {
            propsSetters.hue.setter(node.hue, node.hue, node, cmp);
        }

        propsSetters.boxSize.setter(node.boxSize, node.boxSize, node, cmp);
        propsSetters.width.setter(node.width, node.width, node, cmp);
        propsSetters.height.setter(node.height, node.height, node, cmp);

        if (node.tileTex) {
            propsSetters.tileTex.setter(node.tileTex, node.tileTex, node, cmp);
        }

        if (node.textureSampler) {
            propsSetters.textureSampler.setter(node.textureSampler, node.textureSampler, node, cmp);
        }

        // TODO: dependency fix
        if (node.parentPropName) {
            node.parent[node.parentPropName] = cmp;
        }
        return cmp;
    },
};

module.exports = [StandardMaterialDefinitions, ShaderMaterialDefinitions];
