const { elements: { styles } } = require("react-babylonjs-3d");

export const mat01 = styles.standardMaterial({
    diffuseColor: [1, 0, 0],
    specularColor: [0.5, 0.6, 0.87],
    emissiveColor: [1, 0, 0],
    ambientColor: [0.23, 0.98, 0.53],
});

export const mat02 = styles.standardMaterial({
    diffuseColor: [0, 1, 0],
    specularColor: [1, 0, 0],
    emissiveColor: [0, 1, 0],
    ambientColor: [1, 1, 1],
});
