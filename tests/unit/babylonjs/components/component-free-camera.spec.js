const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () => setupTest(caption, target, { mocksToEnable: ["babylon"] });

describe(caption, function() {
    testHelpers.includeComponentExportTests(setup, { type: "freeCamera" });

    describe("create", function() {
        setup();

        it("should call BABYLON.FreeCamera", function() {
            const { context, symbolByType } = this.mocks;
            const props = { name: "my-name", position: [1, 2, 3] };
            const component = this.target.createComponent(context, props);

            sinon.assert.calledOnce(context.BABYLON.FreeCamera);

            sinon.assert.calledWithExactly(
                context.BABYLON.FreeCamera,
                props.name,
                context.BABYLON.Vector3.getCall(0).returnValue,
                context.scene
            );

            expect(component)
                .to.be.an("object")
                .to.have.property("type", symbolByType["FreeCamera"]);
        });

        it("should use position's values", function() {
            const { context } = this.mocks;
            const props = { name: "my-name", position: [1, 2, 3] };
            this.target.createComponent(context, props);
            sinon.assert.calledOnce(context.BABYLON.Vector3);

            sinon.assert.calledWithExactly(
                context.BABYLON.Vector3,
                ...props.position
            );
        });
    });

    describe("properties", function() {
        setup();

        it("should export only the properties: [position, target, attachControl,defaultTarget]", function() {
            expect(this.target.props).to.have.all.keys(
                "position",
                "target",
                "attachControl",
                "defaultTarget"
            );
        });

        it("should export position", function() {
            expect(this.target.props)
                .to.have.a.property("position")
                .to.have.a.property("newComponentRequired", true);
        });

        it("should export target", function() {
            expect(this.target.props)
                .to.have.a.property("target")
                .to.have.all.keys("setter", "transformer");
        });

        it("should call setTarget from the component", function() {
            const { sandbox } = this;
            const component = sandbox.stub({ setTarget: () => {} });
            const value = "my-value";
            this.target.props.target.setter(component, value);
            sinon.assert.calledOnce(component.setTarget);
            sinon.assert.calledWithExactly(component.setTarget, value);
        });
    });
});
