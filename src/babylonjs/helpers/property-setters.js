const setters = {
    property: propName => {
        const property = (component, value) => (component[propName] = value);
        return property;
    },
    propertyFromComponent: propName => {
        const propertyFromComponent = (component, value) =>
            (component[propName] = value ? value.getComponent() : undefined);
        return propertyFromComponent;
    },
    setFloat: propName => {
        const setFloat = (component, value) =>
            component.setFloat(propName, value);
        return setFloat;
    },
    setVector4: propName => {
        const setVector4 = (component, value) =>
            component.setVector4(propName, value);
        return setVector4;
    },
    setTexture: propName => {
        const setTexture = (component, value) => {
            const newValue =
                value && value.getComponent ? value.getComponent() : value;
            component.setTexture(propName, newValue);
        };
        return setTexture;
    },
    apply: (component, value) => value(component),
};

module.exports = setters;
