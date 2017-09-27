const createNodes = defs =>
    defs.reduce(
        (all, def) =>
            Object.assign(all, {
                [def.tagName]: (canvas, engine, scene) => {
                    const NodeClass = def.nodeClass || NodeBabylon;
                    const node = new NodeClass(def.tagName, engine, scene);

                    const createBabylonComponent = def.creator(
                        def.props,
                        canvas,
                        engine,
                        scene,
                        node
                    );

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
                                def.props.babylonCMP.setter(oldValue, newValue, node, newValue, {
                                    canvas,
                                    engine,
                                    scene,
                                });
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
                            createProp(node, prop, def.props[prop], { canvas, engine, scene });
                        }
                    }

                    return node;
                },
            }),
        { scene: (canvas, engine, scene) => new Node('scene', engine, scene) }
    );
