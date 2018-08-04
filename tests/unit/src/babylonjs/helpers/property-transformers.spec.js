const { fullPath, caption } = getTargetName(__filename);

const setup = () =>
    setupTest(caption, require(fullPath), {
        mocksToEnable: ["babylon", "elements"],
    });

describe(caption, function() {
    describe("Vector3", function() {
        setup();
        it("should transform", function() {
            const { target, mocks: { context, BABYLON, symbolByType } } = this;
            const expectedResult = {
                type: symbolByType["Vector3"],
                args: [1, 2, 3],
            };

            const result = target.vector3(context, [1, 2, 3]);

            expect(result).to.eqls(expectedResult);

            sinon.assert.calledOnce(BABYLON.Vector3);
            sinon.assert.calledWithExactly(BABYLON.Vector3, 1, 2, 3);
        });
    });

    describe("component", function() {
        setup();

        it("should have the property needLastReturned = true", function() {
            const { target: { component: target } } = this;

            expect(target).to.have.property("needLastReturned", true);
        });

        it("should return null if value is null", function() {
            const { target: { component: target } } = this;

            const result = target(null, null);

            expect(result).to.eqls(null);
        });

        it("should create a new component", function() {
            const { target: { component: target }, mocks: { context } } = this;
            const { elements } = context;
            const params = {
                type: "shaderMaterial",
                value: { name: "my-name", width: 1000 },
            };

            const expectedResult = { a: "that-is-me" };

            elements.byType.shaderMaterial.returns(expectedResult);

            const result = target(context, params);

            expect(result).to.eqls(expectedResult);
            sinon.assert.calledOnce(elements.byType.shaderMaterial);
            sinon.assert.calledWithExactly(
                elements.byType.shaderMaterial,
                context,
                params.props
            );
        });

        it("should call prevReturned.updateProps if prevReturned is not null and return prevReturned", function() {
            const { sandbox, target: { component: target } } = this;
            const params = {
                type: "shaderMaterial",
                value: { name: "my-name", width: 1000 },
            };

            const prevReturned = sandbox.stub({ updateProps: () => {} });

            const result = target(null, params, prevReturned);

            expect(result).to.eqls(prevReturned);
            sinon.assert.calledOnce(prevReturned.updateProps);
            sinon.assert.calledWithExactly(
                prevReturned.updateProps,
                params.props
            );
        });

        it("should call prevReturned.dispose if prevReturned is not null and value is null", function() {
            const { sandbox, target: { component: target } } = this;

            const prevReturned = sandbox.stub({ dispose: () => {} });

            const result = target(null, null, prevReturned);

            expect(result).to.eqls(null);
            sinon.assert.calledOnce(prevReturned.dispose);
        });
    });
});
