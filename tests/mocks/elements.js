const create = sandbox => {
    const shaderMaterial = sandbox.stub();
    shaderMaterial.type = "shaderMaterial";
    const elements = {
        byType: {
            shaderMaterial,
        },
    };

    const context = {
        elements,
    };

    return {
        context,
    };
};

module.exports = { create };
