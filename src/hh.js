const { h } = require('snabbdom');
const { hooks } = require('./def');
const myHook = name => ({
    // init: (...args) => console.log(`${name.toUpperCase()}.hook.INIT=>`, args),
    // create: (...args) => console.log(`${name.toUpperCase()}.hook.CREATE=>`, args),
    // insert: (...args) => console.log(`${name.toUpperCase()}.hook.INSERT=>`, args),
    // prepatch: (...args) => console.log(`${name.toUpperCase()}.hook.PREPATCH=>`, args),
    // update: (...args) => console.log(`${name.toUpperCase()}.hook.UPDATE=>`, args),
    // postpatch: (...args) => console.log(`${name.toUpperCase()}.hook.POSTPATCH=>`, args),
    destroy: (...args) => console.log(`${name.toUpperCase()}.hook.DESTROY=>`, args),
    remove: (vnode, cb) => {
        console.log(`${name.toUpperCase()}.hook.REMOVE=>`, [vnode, cb]);
        cb();
    },
});

const hh = (name, props, ...children) =>
    h(
        name,
        Object.assign(
            { props },
            { hook: myHook(name) },
            hooks[name] ? { hook: hooks[name] } : null
        ),
        children
    );

module.exports = hh;
