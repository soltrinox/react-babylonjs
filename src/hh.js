const { h } = require('snabbdom');

const hh = (name, props, ...children) => h(name, { props }, children);

module.exports = hh;
