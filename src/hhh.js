const hh = require('./hh');

const hhh = (name, props, ...children) => {
    console.log('hhh', { name, props, children });
    return hh(name, { props }, children);
};

module.exports = hhh;
