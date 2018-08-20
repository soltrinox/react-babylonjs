const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () => setupTest(caption, target, { mocksToEnable: ["babylon"] });

describe(caption, function() {
    testHelpers.includeComponentExportTests(setup, { type: "sphere" });

    describe("create", function() {
        setup();

        it("should call BABYLON.Mesh.CreateSphere", function() {
            const { context, symbolByType } = this.mocks;
            const props = {
                name: "my-name",
                segments: Symbol("segments"),
                diameter: Symbol("diameter"),
            };
            const expectedArgs = [
                props.name,
                props.segments,
                props.diameter,
                context.scene,
            ];

            const component = this.target.createComponent(context, props);

            sinon.assert.calledOnce(context.BABYLON.Mesh.CreateSphere);

            sinon.assert.calledWithExactly(
                context.BABYLON.Mesh.CreateSphere,
                props.name,
                props.segments,
                props.diameter,
                context.scene
            );

            expect(component)
                .to.be.an("object")
                .to.have.property("type", symbolByType["Sphere"]);

            expect(component)
                .to.be.an("object")
                .to.have.property("args")
                .to.be.eqls(expectedArgs);
        });
    });

    describe("properties", function() {
        setup();

        it("should export the properties", function() {
            expect(this.target.props).to.include.all.keys(
                "segments",
                "diameter",
                "infiniteDistance",
                "position",
                "material"
            );
        });

        it("should export segments", function() {
            expect(this.target.props)
                .to.have.a.property("segments")
                .to.have.a.property("newComponentRequired", true);
        });

        it("should export diameter", function() {
            expect(this.target.props)
                .to.have.a.property("diameter")
                .to.have.a.property("newComponentRequired", true);
        });

        it("should assign a property on infiniteDistance's setter", function() {
            const component = {};
            const value = "my-value";

            this.target.props.infiniteDistance.setter(component, value);
            expect(component)
                .to.have.property("infiniteDistance")
                .to.be.equals(value);
        });

        it("should export position", function() {
            expect(this.target.props)
                .to.have.a.property("position")
                .to.have.all.keys("setter", "transformer");

            expect(this.target.props.position.setter)
                .to.be.a("function")
                .to.have.a.property("name", "property");

            expect(this.target.props.position.transformer)
                .to.be.a("function")
                .to.have.a.property("name", "vector3");
        });
    });
});
