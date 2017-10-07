const { h } = require('snabbdom');

const hh = (name, values, children) => {
    console.log('hh',{name, values, children})
    return h(name, values, children)
};

module.exports = hh;
