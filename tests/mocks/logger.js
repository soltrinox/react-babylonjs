const create = sandbox => {
    const logger = sandbox.stub({
        warn: () => {},
    });

    const context = {
        logger,
    };
    return {
        context,
    };
};

module.exports = { create };
