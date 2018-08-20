const { clone, equals } = require("./utils");

const shouldCreateNewComponent = propsDefinitions => {
    const defs = Object.keys(propsDefinitions)
        .filter(def => propsDefinitions[def].newComponentRequired)
        .reduce((acc, key) => Object.assign(acc, { [key]: true }), {});

    return (props, currentProps) => {
        for (let prop in props) {
            if (defs[prop] && !equals(currentProps[prop], props[prop])) {
                return true;
            }
        }
        return false;
    };
};

const validateComponent = (type, definition, updater) => {
    if (!type) {
        throw new Error("Component's type is required");
    }

    if (!definition) {
        throw new Error("Component's definition is required");
    }

    if (!definition.createComponent) {
        throw new Error(
            "Component's definition's must have a property createComponent"
        );
    }

    if (!updater) {
        throw new Error("Updater is required");
    }
};
const createPropFilter = (propDefinitions, cb) => obj => {
    const result = {};
    for (const key in obj) {

        if (!propDefinitions[key]) {
            continue;
        }

        result[key] = obj[key];
    }
    return cb(result);
};

const compose = (type, definition, updater) => {
    validateComponent(type, definition, updater);

    const definitionProps = Object.assign({}, definition.props);

    const requireNewComponent = shouldCreateNewComponent(definitionProps);
    const cloneProps =  createPropFilter(definitionProps, clone);

    const creator = (context, providedProps) => {
        const props = cloneProps(providedProps);

        let componentId;
        let baseComponent;

        const getComponent = () => baseComponent;
        const internalCreateComponent = () => {
            const tmpProps = cloneProps(props);
            if (baseComponent) {
                baseComponent.dispose();
            }
            baseComponent = definition.createComponent(context, tmpProps);
        };

        internalCreateComponent();

        const instance = {
            getComponent,
            updateProps: values => {
                const createNewComponent = requireNewComponent(values, props);

                Object.assign(props, cloneProps(values));

                if (createNewComponent === true) {
                    internalCreateComponent();
                    return;
                }
                updater(context, getComponent(), cloneProps(values), componentId);
            },
            dispose: () => {
                // TODO: come up with a better way of doing it
                if (type === "scene") {
                    return;
                }
                updater.dispose(context, getComponent(), props, componentId);
                getComponent().dispose();
            },
        };

        componentId = context.componentManager.newId(instance);
        updater(context, getComponent(), cloneProps(props), componentId);
        return instance;
    };

    creator.type = type;

    return creator;
};

module.exports = { compose };
