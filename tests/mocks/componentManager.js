const create = sandbox => {
    const componentManager = {
        newId: sandbox.stub(),
        save: sandbox.stub(),
        get: sandbox.stub(),
    };

    const context = {
        componentManager,
    };

    return {
        context,
    };
};

module.exports = { create };
