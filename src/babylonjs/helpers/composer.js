const equals = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    if (typeof a === "object" && typeof b === "object") {
        for (let key in a) {
            if (equals(a[key], b[key]) === false) {
                return false;
            }
        }

        for (let key in b) {
            if (equals(a[key], b[key]) === false) {
                return false;
            }
        }

        return true;
    }

    return a === b;
};

const clone = obj => {
    if (Array.isArray(obj)) {
        return obj.slice(0);
    }

    if (typeof obj !== "object") {
        return obj;
    }

    const newObj = Object.assign({}, obj);

    for (let key in obj) {
        newObj[key] = clone(obj[key]);
    }

    return newObj;
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

const compose = (type, definition, updater) => {
    validateComponent(type, definition, updater);

    const definitionProps = Object.assign({}, definition.props);

    const requireNewComponent = shouldCreateNewComponent(definitionProps);

    const creator = (context, providedProps) => {
        const props = clone(providedProps);

        let componentId;
        let baseComponent;

        const getComponent = () => baseComponent;
        const internalCreateComponent = () => {
            const tmpProps = clone(props);
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

                Object.assign(props, clone(values));

                if (createNewComponent === true) {
                    internalCreateComponent();
                    return;
                }
                updater(context, getComponent(), clone(values), componentId);
            },
            dispose: () => {
                updater.dispose(context, getComponent(), props, componentId);
                getComponent().dispose();
            },
        };

        componentId = context.componentManager.newId(instance);
        updater(context, getComponent(), clone(props), componentId);
        return instance;
    };

    creator.type = type;

    return creator;
};

module.exports = { compose };
