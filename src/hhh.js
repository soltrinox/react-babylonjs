const hh = require('./hh');

const hhh = (name, props, ...children) => {
    if (typeof name === 'function') {
        const a = name(Object.assign({}, name.defaultProps, props), children);
        return a;
    }

    return hh(name, { props }, children);
};

module.exports = hhh;
