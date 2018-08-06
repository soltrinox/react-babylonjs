const { fullPath, caption } = getTargetName(__filename);
const target = require(fullPath);

const setup = () => setupTest(caption, target, { mocksToEnable: ["babylon"] });

describe(caption, function() {
    testHelpers.includeComponentExportTests(setup, { type: "shaderMaterial" });

    describe("create", function() {
        setup();

        it("should call BABYLON.ShaderMaterial", function() {
            const { context, symbolByType } = this.mocks;
            const props = {
                name: "my-name",
                shaderPath: Symbol("shaderPath"),
                attributes: ["attributes"],
                uniforms: ["uniforms"],
            };
            const expectedArgs = [
                props.name,
                context.scene,
                props.shaderPath,
                { attributes: props.attributes, uniforms: props.uniforms },
            ];

            const component = this.target.createComponent(context, props);

            sinon.assert.calledOnce(context.BABYLON.ShaderMaterial);

            expect(component)
                .to.be.an("object")
                .to.have.property("type", symbolByType["ShaderMaterial"]);

            expect(component)
                .to.be.an("object")
                .to.have.property("args")
                .to.be.eqls(expectedArgs);

            sinon.assert.calledWithExactly(
                context.BABYLON.ShaderMaterial,
                ...expectedArgs
            );
        });
    });

    describe("properties", function() {
        setup();
        const _props = [
            "shaderPath",
            "attributes",
            "uniforms",
            "backFaceCulling",
            "boxSize",
            "diffuseColor",
            "edgeColor",
            "height",
            "hue",
            "name",
            "tileTex",
            "width",
        ];
        it(`should export only the properties: ${_props}`, function() {
            expect(this.target.props).to.have.all.keys(_props);
        });

        it("should export shaderPath", function() {
            expect(this.target.props)
                .to.have.a.property("shaderPath")
                .to.have.a.property("newComponentRequired", true);
        });

        it("should export attributes", function() {
            expect(this.target.props)
                .to.have.a.property("attributes")
                .to.have.a.property("newComponentRequired", true);
        });

        it("should export uniforms", function() {
            expect(this.target.props)
                .to.have.a.property("uniforms")
                .to.have.a.property("newComponentRequired", true);
        });

        // it("should assign a property on infiniteDistance's setter", function() {
        //     const { sandbox } = this;
        //     const component = {};
        //     const value = 'my-value';

        //     this.target.props.infiniteDistance.setter(component, value);
        //     expect(component)
        //         .to.have.property('infiniteDistance')
        //         .to.be.equals(value);
        // });

        // it('should export position', function() {
        //     expect(this.target.props)
        //         .to.have.a.property('position')
        //         .to.have.all.keys('setter', 'transform');

        //     expect(this.target.props.position.setter)
        //         .to.be.a('function')
        //         .to.have.a.property('name', 'property');

        //     expect(this.target.props.position.transform)
        //         .to.be.a('function')
        //         .to.have.a.property('name', 'vector3');
        // });
    });
});
