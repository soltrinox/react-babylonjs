"use strict";
const { mergeDeepRight: mergeDeep } = require("ramda");

const setupTest = (name, target, opts) => {
    const { mocksToEnable, verbose } = Object.assign(
        { mocksToEnable: [], verbose: false },
        opts
    );

    before(function() {
        if (verbose && name) {
            console.log(`${name}-> before`);
        }

        this.target = target;
        this.sandbox = sinon.sandbox.create();

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
            console.log(`${name}-> beforeEach`);
        }
        this.sandbox.resetHistory();
    });
};

module.exports = setupTest;
