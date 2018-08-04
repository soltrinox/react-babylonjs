const { mergeDeepRight: mergeDeep } = require("ramda");

const setupTest = (name, target, opts) => {
    const { mocksToEnable, verbose } = Object.assign(
        { mocksToEnable: [], verbose: false },
        opts
    );

    before(function() {
        if (verbose && name) {
            // eslint-disable-next-line no-console
            console.log(`${name}-> before`);
        }

        this.target = target;
        this.sandbox = sinon.createSandbox();

        this.mocks = mocksToEnable.reduce(
            (state, name) =>
                mergeDeep(
                    state,
                    require(`./mocks/${name}`).create(this.sandbox)
                ),
            {}
        );
    });

    beforeEach(function() {
        if (verbose && name) {
            // eslint-disable-next-line no-console
            console.log(`${name}-> beforeEach`);
        }
        this.sandbox.resetHistory();
    });
};

module.exports = setupTest;
