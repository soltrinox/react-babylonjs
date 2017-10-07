'use strict';

const createComponent = opts => {
    if (!opts || !opts.api) {
        throw new Error(
            'Invalid paramaters, you need to provide an object with a key named api:\n{ api: createBabylonSceneAPI(...) }'
        );
    }

    const { api } = opts;
    let previousVtree = null;

    return {
        render: vtree => {
            if (!vtree) {
                throw new Error('Invalid paramaters, you need a vtree.');
            }

            const rootElement = previousVtree || api.createRootElement();
            previousVtree = api.patch(rootElement, vtree);
        },
        dispose: () => {},
    };
};

const hh = (name, props, children) => {
    return { name, props, children };
};

module.exports = { createComponent, hh };
