const getValue = (transformer, propValue, propName, componentId, context) => {
    if (!transformer) {
        return propValue;
    }

    if (!transformer.needLastReturned) {
        return transformer(context, propValue);
    }

    const keyComponent = `${componentId}::${propName}`;
    const value = transformer(
        context,
        propValue,
        context.componentManager.get(keyComponent)
    );
    context.componentManager.save(keyComponent, value);
    return value;
};

const propertyUpdater = (type, propsDefinition) => {
    const updater = (context, component, props, componentId) =>
        Object.keys(props).forEach(propName => {
            if (!propsDefinition[propName]) {
                context.logger.warn(
                    `property [${propName}] is not defined for the component <${type}>`
                );
                return;
            }

            if (propsDefinition[propName].newComponentRequired === true) {
                return;
            }

            const { transformer, setter } = propsDefinition[propName];

            const value = getValue(
                transformer,
                props[propName],
                propName,
                componentId,
                context
            );

            setter(component, value);
        });

    updater.dispose = (context, component, props, componentId) => {
        Object.keys(propsDefinition).forEach(propName => {
            const prop = propsDefinition[propName];
            if (prop.dispose) {
                const keyComponent = `${componentId}::${propName}`;
                prop.dispose(
                    component,
                    context.componentManager.get(keyComponent),
                    propsDefinition[propName].setter
                );
            }
        });
    };
    return updater;
};

module.exports = propertyUpdater;
