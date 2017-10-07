const R = require('ramda');
const { NodeBabylon } = require('./node');

const createProp = (node, name, opts, context) =>
    Object.defineProperty(node, name, {
        set: function(value) {
            // TODO: reafactor this shit code, let's compose it!
            const newValue = opts.transform ? opts.transform(value) : value;
            const oldValue = this[`_${name}`];

            if (R.equals(oldValue, newValue)) {
                if (!opts.everySet) return;
            }

            if (opts.setOnce) {
                if (oldValue !== undefined) {
                    throw new Error(`${node.tagName}.${name} can't be set more than once`);
                }
            }

            this[`_${name}`] = newValue;

            if (opts.createIfNotExists && !this.babylonCMP) {
                this.babylonCMP = this.createBabylonComponent();
            }

            if (!this.babylonCMP) {
                return;
            }

            if (opts.recreate) {
                this.babylonCMP = this.createBabylonComponent();
            }

            if (opts.setter) {
                opts.setter(oldValue, newValue, this, this.babylonCMP, context);
            }
        },
        get: function() {
            if (opts.createOnGet && !this[`_${name}`]) {
                this[`_${name}`] = opts.creator(this, this.babylonCMP, context);
            }

            return this[`_${name}`];
        },
    });

const wrapperDef = def => context => {
    const NodeClass = def.nodeClass || NodeBabylon;
    const node = new NodeClass(def.tagName, context);

    const createBabylonComponent = def.creator(def.props, context, node);

    node.createBabylonComponent = () => {
        return createBabylonComponent();
    };

    Object.defineProperty(node, 'babylonCMP', {
        set: function(newValue) {
            const oldValue = this._babylonCMP;

            if (oldValue != newValue) {
                if (oldValue) {
                    const oldParent = oldValue.parent;
                    if (newValue) {
                        newValue.parent = oldParent;
                    }
                }
            }

            this._babylonCMP = newValue;
            if (def.props.babylonCMP && def.props.babylonCMP.setter) {
                def.props.babylonCMP.setter(oldValue, newValue, node, newValue, context);
            }

            if (oldValue) {
                oldValue.dispose(true);
            }
        },
        get: function() {
            return this._babylonCMP;
        },
    });

    for (let prop in def.props) {
        if (prop !== 'babylonCMP') {
            createProp(node, prop, def.props[prop], context);
        }
    }

    return node;
};

const componentToNodes = R.reduce(
    (all, def) => Object.assign(all, { [`${def.tagName}`]: wrapperDef(def) }),
    {}
);

module.exports = {
    componentToNodes,
};
