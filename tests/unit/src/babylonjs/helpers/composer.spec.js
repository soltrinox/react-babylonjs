const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () => {
    setupTest(caption, target, {
        mocksToEnable: ["babylon", "componentManager"],
    });
    before(function() {
        Object.assign(this.mocks, {
            updater: this.sandbox.spy(() => {}),
            definitionNoProps: { createComponent: this.sandbox.stub() },
            type: "box",
            definitionBox: {
                createComponent: this.sandbox.stub(),
                props: {
                    position: this.sandbox.stub({
                        transformer: () => {},
                        setter: () => {},
                    }),
                },
            },
            box: this.sandbox.stub({ dispose: () => {}, position: () => {} }),
            definitionFreeCamera: {
                createComponent: this.sandbox.stub(),
                props: {
                    position: this.sandbox.stub({
                        setter: () => {},
                        newComponentRequired: true,
                    }),
                    target: this.sandbox.stub({
                        setter: () => {},
                    }),
                },
            },
            camera: this.sandbox.stub({
                dispose: () => {},
                position: () => {},
                setTarget: () => {},
            }),
        });
        this.mocks.updater.dispose = this.sandbox.stub();
    });
};

describe(caption, function() {
    describe("compose", function() {
        setup();

        it("should export a [compose] function", function() {
            expect(this.target)
                .to.have.a.property("compose")
                .to.be.a("function");
        });

        it("should throw an Error if the type is not provided", function() {
            const expectError = "Component's type is required";
            expect(() => this.target.compose()).to.throw(expectError);
        });

        it("should throw an Error if the definition is not provided", function() {
            const type = "box";
            const expectError = "Component's definition is required";
            expect(() => this.target.compose(type)).to.throw(expectError);
        });

        it("should throw an Error if the definition does not have a property createComponent", function() {
            const type = "box";
            const definition = {};
            const expectError =
                "Component's definition's must have a property createComponent";
            expect(() => this.target.compose(type, definition)).to.throw(
                expectError
            );
        });

        it("should throw an Error if the updater is not provided", function() {
            const { mocks: { definitionNoProps: definition, type } } = this;
            const expectError = "Updater is required";
            expect(() => this.target.compose(type, definition)).to.throw(
                expectError
            );
        });

        it("should return a creator(function) of the provided type", function() {
            const { mocks: { definitionNoProps: definition, updater } } = this;
            const type = "box";
            const result = this.target.compose(type, definition, updater);

            expect(result)
                .to.an("function")
                .to.have.a.property("type")
                .to.be.equals(type);
        });
    });

    describe("create component", function() {
        setup();

        it("should call createComponent function", function() {
            const {
                mocks: {
                    definitionNoProps: definition,
                    type,
                    context,
                    updater,
                },
            } = this;
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            myComponentWrapper(context, {});

            sinon.assert.calledOnce(definition.createComponent);
            sinon.assert.calledWithExactly(
                definition.createComponent,
                context,
                {}
            );
        });

        it("should create a componentId", function() {
            const {
                mocks: {
                    definitionNoProps: definition,
                    type,
                    context,
                    updater,
                },
            } = this;
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            const component = myComponentWrapper(context, {});

            sinon.assert.calledOnce(definition.createComponent);
            sinon.assert.calledWithExactly(
                definition.createComponent,
                context,
                {}
            );

            sinon.assert.calledOnce(context.componentManager.newId);
            sinon.assert.calledWithExactly(
                context.componentManager.newId,
                component
            );
        });

        it("should pass along componentId to the updater", function() {
            const {
                mocks: {
                    definitionBox: definition,
                    type,
                    context,
                    updater,
                },
            } = this;
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            const componentId = "mmmmm";
            const component = { position: [1, 2, 3] };

            definition.createComponent.returns(component);
            context.componentManager.newId.returns(componentId);

            const props = { position: [1, 2, 3] };
            myComponentWrapper(context, props);

            sinon.assert.calledOnce(updater);
            sinon.assert.calledWithExactly(
                updater,
                context,
                component,
                props,
                componentId
            );
        });

        it("should return an Object with the methods: [updateProps, dispose, getComponent]", function() {
            const {
                mocks: {
                    definitionNoProps: definition,
                    type,
                    context,
                    updater,
                },
            } = this;
            const props = {};
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );
            const component = myComponentWrapper(context, props);

            expect(component)
                .to.have.property("getComponent")
                .to.be.a("function");

            expect(component)
                .to.have.property("updateProps")
                .to.be.a("function");

            expect(component)
                .to.have.property("dispose")
                .to.be.a("function");
        });

        it("[getComponent] should return the created component", function() {
            const {
                mocks: {
                    definitionNoProps: definition,
                    type,
                    context,
                    updater,
                },
            } = this;
            const props = {};
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );
            const baseComponent = "123";
            definition.createComponent.returns(baseComponent);

            const component = myComponentWrapper(context, props);

            expect(component.getComponent()).to.be.equals(baseComponent);
        });

        it("should throw the same error if createComponent throws", function() {
            const expectError = "Missing required field(s): [position].";

            const {
                mocks: {
                    definitionNoProps: definition,
                    scene,
                    BABYLON,
                    type,
                    updater,
                },
            } = this;
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );
            const props = {};

            definition.createComponent.throws(new Error(expectError));
            expect(() =>
                myComponentWrapper({ BABYLON, scene }, props)
            ).to.throw(expectError);
        });

        it("should call the updater properties after create a component", function() {
            const {
                mocks: {
                    definitionBox: definition,
                    context,
                    type,
                    box,
                    updater,
                },
            } = this;

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.returns(box);

            const props = { position: [1, 1, 1] };

            myComponentWrapper(context, props);

            sinon.assert.calledOnce(updater);
            sinon.assert.calledWith(updater, context, box, props);
        });

        it("should ignore properties with newComponentRequired:true after create a component", function() {
            const {
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera,
                    updater,
                },
            } = this;
            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.returns(camera);

            const props = { position: [1, 1, 1] };

            myComponentWrapper(context, props);
            sinon.assert.notCalled(definition.props.position.setter);
        });
    });

    describe("dispose", function() {
        setup();

        it("should call component.dispose when disposing the component", function() {
            const {
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera,
                    updater,
                },
            } = this;

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.returns(camera);

            const props = { position: [0, 0, 0] };

            const component = myComponentWrapper(context, props);

            component.dispose();

            sinon.assert.calledOnce(camera.dispose);
        });

        it("should call updater.dispose when disposing the component", function() {
            const {
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera,
                    updater,
                },
            } = this;

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.returns(camera);

            const props = { position: [0, 0, 0] };
            const myId = "any-thing";
            context.componentManager.newId.returns(myId);
            const component = myComponentWrapper(context, props);

            component.dispose();

            sinon.assert.calledOnce(updater.dispose);
            sinon.assert.calledWithExactly(
                updater.dispose,
                context,
                camera,
                props,
                myId
            );
        });
    });

    describe("update", function() {
        setup();

        it("should create another component if a property {newComponentRequired: true} is changed", function() {
            const {
                sandbox,
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera: camera0,
                    updater,
                },
            } = this;
            const camera1 = sandbox.stub({ position: () => {} });

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.onCall(0).returns(camera0);
            definition.createComponent.onCall(1).returns(camera1);

            const props0 = { position: [0, 0, 0] };
            const props1 = { position: [1, 1, 1] };

            const component = myComponentWrapper(context, props0);
            expect(component.getComponent()).to.be.equals(camera0);

            component.updateProps(props1);
            expect(component.getComponent()).to.be.equals(camera1);

            sinon.assert.calledTwice(definition.createComponent);
            sinon.assert.calledWithExactly(
                definition.createComponent.getCall(0),
                context,
                props0
            );
            sinon.assert.calledWithExactly(
                definition.createComponent.getCall(1),
                context,
                props1
            );
        });

        it("should recreate the component more than twice accumulating the properties", function() {
            const {
                sandbox,
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera: camera0,
                    updater,
                },
            } = this;
            const camera1 = sandbox.stub({
                dispose: () => {},
                position: () => {},
            });
            const camera2 = sandbox.stub({
                dispose: () => {},
                position: () => {},
            });

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.onCall(0).returns(camera0);
            definition.createComponent.onCall(1).returns(camera1);
            definition.createComponent.onCall(2).returns(camera2);

            const props0 = { position: [0, 0, 0] };
            const props1 = { position: [1, 1, 1] };
            const props2 = { position: [2, 2, 2] };

            const component = myComponentWrapper(context, props0);
            component.updateProps(props1);
            component.updateProps(props2);

            sinon.assert.calledThrice(definition.createComponent);
            sinon.assert.calledWithExactly(
                definition.createComponent.getCall(1),
                context,
                props1
            );
            sinon.assert.calledWithExactly(
                definition.createComponent.getCall(2),
                context,
                props2
            );
        });

        it("should dispose the old component before create a new one", function() {
            const {
                sandbox,
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera: camera0,
                    updater,
                },
            } = this;
            const camera1 = sandbox.stub({
                dispose: () => {},
                position: () => {},
            });

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.onCall(0).returns(camera0);
            definition.createComponent.onCall(1).returns(camera1);

            const props0 = { position: [0, 0, 0] };
            const props1 = { position: [1, 1, 1] };

            const component = myComponentWrapper(context, props0);
            component.updateProps(props1);

            expect(
                camera0.dispose
                    .getCall(0)
                    .calledBefore(definition.createComponent.secondCall)
            ).to.be.true;
        });

        it("should set a property in the current mesh", function() {
            const {
                mocks: {
                    definitionFreeCamera: definition,
                    context,
                    type,
                    camera,
                    updater,
                },
            } = this;

            const myComponentWrapper = this.target.compose(
                type,
                definition,
                updater
            );

            definition.createComponent.returns(camera);

            const props0 = { position: [0, 0, 0], target: [1, 2, 3] };
            const props1 = { target: [3, 3, 3] };

            const component = myComponentWrapper(context, props0);

            component.updateProps(props1);

            sinon.assert.calledTwice(updater);
            sinon.assert.calledWith(
                updater.getCall(0),
                context,
                camera,
                props0
            );
            sinon.assert.calledWith(
                updater.getCall(1),
                context,
                camera,
                props1
            );
        });
    });

    describe("not defined properties", function () {
        setup();

        beforeEach(function () {
            const {
                mocks: {
                    definitionBox: definition,
                    type,
                    box,
                    updater,
                },
            } = this;
            this.componentWrapper = this.target.compose(
                type,
                definition,
                updater
            );
            definition.createComponent.returns(box);
        });

        it("should filter out not defined properties when create", function () {
            const {
                mocks: {
                    context,
                    updater,
                    box,
                },
            } = this;

            const notDefinedProp = { desc : "I'm not defined" };
            const position = [1, 1, 1];
            const expectedProps = { position };

            this.componentWrapper(context, { position, notDefinedProp });

            sinon.assert.calledOnce(updater);
            sinon.assert.calledWithExactly(updater, context, box, expectedProps, undefined);
        });

        it("should filter out not defined properties when update", function () {
            const {
                mocks: {
                    context,
                    updater,
                    box,
                },
            } = this;

            const expectedPropsToUpdate = { };

            const component = this.componentWrapper(context, { position: [1, 1, 1] });
            component.updateProps({ notDefinedProp: "I'm not defined" });

            sinon.assert.calledTwice(updater);
            sinon.assert.calledWithExactly(
                updater.getCall(1),
                context,
                box,
                expectedPropsToUpdate,
                undefined);

        });
    });
});
