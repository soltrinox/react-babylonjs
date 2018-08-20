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

            setter(component, value, context);
        });

    updater.dispose = (context, component, props, componentId) => {
        if (!component) return;
        Object.keys(propsDefinition).forEach(propName => {
            const prop = propsDefinition[propName];
            if (!prop.dispose) {
                return;
            }

            const keyComponent = `${componentId}::${propName}`;
            const propComponent = context.componentManager.get(keyComponent);

            if (!propComponent) {
                return;
            }

            prop.dispose(
                component,
                propComponent,
                propsDefinition[propName].setter
            );
        });
    };
    return updater;
};

module.exports = propertyUpdater;
