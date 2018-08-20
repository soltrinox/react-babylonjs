const actionManagerProperty = {
    setter: (component, { cmp, props }) => {
        component.actionManager = cmp.getComponent();
        cmp.updateProps(props);
    },
    transformer: (context, props, prev) => {
        // find removed events
        const propsToRemove = {};
        if (prev && prev.props) {
            for (const key in prev.props) {
                if (!props[key]) {
                    propsToRemove[key] = null;
                }
            }
        }

        return {
            cmp:
                prev && prev.cmp
                    ? prev.cmp
                    : context.elements.byType.actionManager(context, props),
            props: Object.assign({}, props, propsToRemove),
        };
    },
    dispose: (parent, component) => component.cmp.dispose(),
};
module.exports = actionManagerProperty;
