const disposers = {
    component: (component, lastValue, setter) => {
        if (!lastValue) {
            return;
        }
        setter(component, undefined);
        lastValue.dispose();
    },
};

module.exports = disposers;
