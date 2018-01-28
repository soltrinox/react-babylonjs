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
                "prepareUpdate",
                "prepareForCommit",
                "resetAfterCommit",
                "shouldSetTextContent",
                "resetTextContent",
                "createTextInstance",
                "commitTextUpdate",
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
});
