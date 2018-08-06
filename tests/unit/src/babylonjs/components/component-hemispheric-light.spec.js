const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () => setupTest(caption, target, { mocksToEnable: ["babylon"] });

describe(caption, function() {
    testHelpers.includeComponentExportTests(setup, {
        type: "hemisphericLight",
    });

    describe("create", function() {
        setup();

        it("should call BABYLON.HemisphericLight", function() {
            const { context, symbolByType } = this.mocks;
            const props = { name: "my-name", target: [1, 2, 3] };

            const component = this.target.createComponent(context, props);

            sinon.assert.calledOnce(context.BABYLON.HemisphericLight);

            sinon.assert.calledWithExactly(
                context.BABYLON.HemisphericLight,
                props.name,
                context.BABYLON.Vector3.getCall(0).returnValue,
                context.scene
            );

            expect(component)
                .to.be.an("object")
                .to.have.property("type", symbolByType["HemisphericLight"]);
        });

        it("should use target's values when create BABYLON.HemisphericLight", function() {
            const { context } = this.mocks;
            const props = { name: "my-name", target: [1, 2, 3] };
            this.target.createComponent(context, props);
            sinon.assert.calledOnce(context.BABYLON.Vector3);

            sinon.assert.calledWithExactly(
                context.BABYLON.Vector3,
                ...props.target
            );
        });
    });

    describe("properties", function() {
        setup();

        it("should export only the properties: [target, intensity]", function() {
            expect(this.target.props).to.have.all.keys(
                "target",
                "intensity",
                "name"
            );
        });

        it("should export target", function() {
            expect(this.target.props)
                .to.have.a.property("target")
                .to.have.a.property("newComponentRequired", true);
        });

        it("should export intensity", function() {
            expect(this.target.props)
                .to.have.a.property("intensity")
                .to.have.all.keys("setter");
        });

        it("should assign a property on intensity's setter", function() {
            const component = {};
            const value = "my-value";

            this.target.props.intensity.setter(component, value);
            expect(component)
                .to.have.property("intensity")
                .to.be.equals(value);
        });
    });
});
