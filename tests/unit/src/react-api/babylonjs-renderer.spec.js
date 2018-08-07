const { fullPath, caption } = getTargetName(__filename);

const setup = () =>
    setupTest(caption, require(fullPath), { mocksToEnable: [] });

describe(caption, function() {
    describe("exports", function() {
        setup();

        it("should export a function", function() {
            expect(this.target).to.be.a("function");
        });
    });

    describe("create", function() {
        setup();
        it("should create an babylonJSRenderer", function() {
            this.babylonJSRenderer = this.target({});
            expect(this.babylonJSRenderer).to.be.an("object");
        });

        it("should have all react-reconcilier propertie", function() {
            const props = [
                "mutation",
                "useSyncScheduling",
                "getPublicInstance",
                "getRootHostContext",
                "getChildHostContext",
                "now",
                "createInstance",
                "finalizeInitialChildren",
                "appendInitialChild",
                "insertBefore",
                "commitMount",
                "prepareUpdate",
                "prepareForCommit",
                "resetAfterCommit",
                "shouldSetTextContent",
                "resetTextContent",
                "createTextInstance",
                "commitTextUpdate",
                "supportsMutation",
                "removeChild",
                "removeChildFromContainer",
                "commitUpdate",
                "appendChildToContainer",
                "appendChild",
            ];
            expect(this.babylonJSRenderer).to.have.all.keys(...props);
        });
    });

    describe("createInstance", function() {
        setup();

        before(function() {
            const { sandbox } = this;
            this.opts = sandbox.stub({
                Node: () => {},
                logger: sandbox.stub({ debug: () => {} }),
            });
            this.babylonJSRenderer = this.target(this.opts);
        });

        it("should create a node", function() {
            const { sandbox } = this;
            const type = "my-type";
            const props = {};
            const rootContainerInstance = {
                props: {
                    elements: {
                        byType: {
                            [type]: sandbox.stub(),
                        },
                    },
                },
            };
            const hostContext = {};
            const internalInstanceHandle = {};

            this.babylonJSRenderer.createInstance(
                type,
                props,
                rootContainerInstance,
                hostContext,
                internalInstanceHandle
            );

            sinon.assert.calledOnce(
                rootContainerInstance.props.elements.byType[type]
            );

            sinon.assert.calledWithExactly(
                rootContainerInstance.props.elements.byType[type],
                hostContext,
                props
            );
        });
    });
    describe("update", function() {
        setup();

        it("should commitUpdate", function() {
            const instance = { cmp: { updateProps: this.sandbox.stub() } };
            const newProps = { a: 123 };
            this.target({}).mutation.commitUpdate(instance, newProps);
            sinon.assert.calledOnce(instance.cmp.updateProps);
            sinon.assert.calledWithExactly(instance.cmp.updateProps, newProps);
        });
    });

    describe("children", function() {
        setup();

        it("should appendChild to the parent", function() {
            const parent = this.sandbox.stub({ appendChild: () => {} });
            const child = 123;
            this.target({}).mutation.appendChild(parent, child);
            sinon.assert.calledOnce(parent.appendChild);
            sinon.assert.calledWithExactly(parent.appendChild, child);
        });
        it("should removeChild from the parent", function() {
            const parent = this.sandbox.stub({ removeChild: () => {} });
            const child = 123;
            this.target({}).mutation.removeChild(parent, child);
            sinon.assert.calledOnce(parent.removeChild);
            sinon.assert.calledWithExactly(parent.removeChild, child);
        });
    });

    describe("getPublicInstance", function() {
        setup();

        it("should getPublicInstance to the parent", function() {
            const instance = { a: 123 };
            expect(this.target({}).getPublicInstance(instance)).equals(
                instance
            );
        });
    });

    describe("getRootHostContext", function() {
        setup();

        it("should getRootHostContext to the parent", function() {
            const container = { props: { a: 1 } };
            expect(this.target({}).getRootHostContext(container)).equals(
                container.props
            );
        });
    });

    describe("getChildHostContext", function() {
        setup();

        it("should getChildHostContext to the parent", function() {
            const parentContext = { a: 1 };
            const type = "type-123";
            const rootContainer = { name: "rootContainer" };
            const expected = {
                a: 1,
                type,
                rootContainer,
            };
            expect(
                this.target({}).getChildHostContext(
                    parentContext,
                    type,
                    rootContainer
                )
            ).eqls(expected);
        });
    });
});
