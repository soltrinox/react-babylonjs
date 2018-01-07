const propertyUpdater = (type, propsDefinition) => {
    return (context, component, props, componentId) => {
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

            let value;
            if (transformer) {
                if (transformer.needLastReturned) {
                    const keyComponent = `${componentId}::${propName}`;
                    value = transformer(
                        context,
                        props[propName],
                        context.componentManager.get(keyComponent)
                    );
                    context.componentManager.save(keyComponent, value);
                } else {
                    value = transformer(context, props[propName]);
                }
            } else {
                value = props[propName];
            }

            setter(component, value);
        });
    };
};

module.exports = propertyUpdater;
