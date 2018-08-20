const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () =>
    setupTest(caption, target, {
        mocksToEnable: ["logger", "componentManager"],
    });

describe(caption, function() {
    setup();

    it("should warn if the property does not exist in the definition", function() {
        const {
            mocks: { context },
        } = this;
        const type = "box";
        const updater = this.target(type, {});

        updater(context, {}, { anyName: "ab" });
        sinon.assert.calledOnce(context.logger.warn);
        sinon.assert.calledWithExactly(
            context.logger.warn,
            `property [anyName] is not defined for the component <${type}>`
        );
    });

    it("should skip newComponentRequired properties", function() {
        const {
            sandbox,
            mocks: { context },
        } = this;
        const type = "box";

        const definitions = {
            anyName: sandbox.stub({ setter: () => {} }),
            notMe: sandbox.stub({
                newComponentRequired: true,
                setter: () => {},
            }),
        };

        const props = { anyName: { height: 1 }, notMe: 1 };

        const updater = this.target(type, definitions);
        updater(context, {}, props);

        sinon.assert.calledOnce(definitions.anyName.setter);
        sinon.assert.calledWithExactly(
            definitions.anyName.setter,
            {},
            props.anyName,
            context
        );

        sinon.assert.notCalled(definitions.notMe.setter);
    });

    it("should call setter without transformer", function() {
        const {
            sandbox,
            mocks: { context },
        } = this;
        const type = "box";
        const definitions = {
            anyName: sandbox.stub({ setter: () => {} }),
        };
        const props = { anyName: { height: 1 } };

        const updater = this.target(type, definitions);
        updater(context, {}, props);

        sinon.assert.calledOnce(definitions.anyName.setter);
        sinon.assert.calledWithExactly(
            definitions.anyName.setter,
            {},
            props.anyName,
            context
        );
    });

    it("should not save nor get the transformer's returned if transformer.needLastReturned !== true ", function() {
        const {
            sandbox,
            mocks: { context },
        } = this;
        const type = "box";
        const definitions = {
            anyName: sandbox.stub({ transformer: () => {}, setter: () => {} }),
        };
        const componentId = "my-component-id";
        const props = { anyName: { height: 1 } };

        const updater = this.target(type, definitions);
        updater(context, {}, props, componentId);

        sinon.assert.notCalled(context.componentManager.save);
        sinon.assert.notCalled(context.componentManager.get);
    });

    it("should save the transformer's returned value in the context.componentManager", function() {
        const {
            sandbox,
            mocks: { context },
        } = this;
        const type = "box";

        const transformer = () => {};
        transformer.needLastReturned = true;

        const definitions = {
            anyName: sandbox.stub({ transformer, setter: () => {} }),
        };
        const componentId = "my-component-id";
        const props = { anyName: { height: 1 } };
        const transformedValue = Symbol({ vla: 1 });
        definitions.anyName.transformer.returns(transformedValue);

        const updater = this.target(type, definitions);
        updater(context, {}, props, componentId);

        sinon.assert.calledOnce(context.componentManager.save);
        sinon.assert.calledWithExactly(
            context.componentManager.save,
            `${componentId}::anyName`,
            transformedValue
        );
    });

    it("should call transformer and passing the last returned value", function() {
        const {
            sandbox,
            mocks: { context },
        } = this;
        const type = "box";
        const transformer = () => {};
        transformer.needLastReturned = true;
        const definitions = {
            anyName: sandbox.stub({ transformer, setter: () => {} }),
        };
        const componentId = "my-component-id";
        const props = { anyName: { height: 1 } };
        const transformedValue = Symbol({ vla: 1 });

        context.componentManager.get
            .withArgs(`${componentId}::anyName`)
            .returns(transformedValue);
        const updater = this.target(type, definitions);
        updater(context, {}, props, componentId);

        sinon.assert.calledOnce(context.componentManager.get);
        sinon.assert.calledWithExactly(
            context.componentManager.get,
            `${componentId}::anyName`
        );

        sinon.assert.calledOnce(definitions.anyName.transformer);
        sinon.assert.calledWithExactly(
            definitions.anyName.transformer,
            context,
            props.anyName,
            transformedValue
        );
    });

    describe("dispose", function() {
        it("should not dispose for props that does not have an instanced component", function() {
            const {
                sandbox,
                mocks: { context },
            } = this;
            const component = "component-";

            const propsDefinition = { prop1: { dispose: sandbox.stub() } };
            const updater = this.target(
                "anything",
                propsDefinition,
            );
            context.componentManager.get.returns(null);

            updater.dispose(context, component);

            sinon.assert.notCalled(propsDefinition.prop1.dispose);
        });

        it("should not call dispose for props if component is null", function() {
            const propsDefinition = { prop1: { dispose: this.sandbox.stub() } };
            const updater = this.target("anything", propsDefinition);
            updater.dispose(context, null);
            sinon.assert.notCalled(propsDefinition.prop1.dispose);
        });

        it("should call dispose for props that have a method named dispose and an instance", function() {
            const {
                sandbox,
                mocks: { context },
            } = this;

            const component = "component-";
            const componentId = "componentId-12";
            const propsDefinition = { prop1: { dispose: sandbox.stub() } };

            const updater = this.target(
                "anything",
                propsDefinition,
            );
            context.componentManager.get.returns(null);
            context.componentManager.get
                .withArgs(`${componentId}::prop1`)
                .returns("aaa");

            updater.dispose(context, component, {}, componentId);
            sinon.assert.calledOnce(propsDefinition.prop1.dispose);
            sinon.assert.calledWith(propsDefinition.prop1.dispose, component);
        });
    });
});
