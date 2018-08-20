const { fullPath, caption } = getTargetName(__filename);

const setup = () =>
    setupTest(caption, require(fullPath), { mocksToEnable: [] });

describe(caption, function() {
    describe("setter", function() {
        setup();

        it("should set property actionManager on the main component", function() {
            const { sandbox, target } = this;
            const instance = { id: "123" };
            const cmp = {
                getComponent: sandbox.stub(),
                updateProps: sandbox.stub(),
            };
            const component = {};
            cmp.getComponent.returns(instance);
            target.setter(component, { cmp });

            expect(component)
                .to.have.property("actionManager")
                .to.be.equals(instance);
        });

        it("should call cmd.updateProps", function() {
            const { sandbox, target } = this;
            const instance = { id: "123" };
            const props = { a: 1, b: 2, c: "123" };
            const cmp = {
                getComponent: sandbox.stub(),
                updateProps: sandbox.stub(),
            };
            const component = {};
            cmp.getComponent.returns(instance);
            target.setter(component, { cmp, props });
            sinon.assert.calledOnce(cmp.updateProps);
            sinon.assert.calledWithExactly(cmp.updateProps, props);
        });
    });

    describe("transformer", function() {
        setup();

        it("should create an actionManager", function() {
            const { sandbox, target } = this;
            const context = {
                elements: {
                    byType: {
                        actionManager: sandbox.stub(),
                    },
                },
            };
            const props = { a: 1, b: "2", c: "abc" };
            target.transformer(context, props);
            sinon.assert.calledOnce(context.elements.byType.actionManager);
            sinon.assert.calledWithExactly(
                context.elements.byType.actionManager,
                context,
                props
            );
        });

        it("should return the previous actionManager", function() {
            const { target } = this;
            const context = null;
            const props = { a: 1, b: "2", c: "abc" };
            const cmp = { id: "cmp-123" };
            const { cmp: returnedCmp } = target.transformer(context, props, {
                cmp,
            });

            expect(returnedCmp).to.be.equals(cmp);
        });

        it("should return the removed properties as null", function() {
            const { target } = this;
            const context = null;
            const cmp = { id: "cmp-123" };
            const prev = {
                cmp,
                props: { a: 1, b: "2", c: "abc" },
            };
            const newProps = { a: 1, c: "abc" };
            const { props: returnedProps } = target.transformer(
                context,
                newProps,
                prev
            );

            const expectedProps = {
                a: 1,
                b: null,
                c: "abc",
            };
            expect(returnedProps).to.be.eqls(expectedProps);
        });
    });

    describe("dispose", function() {
        setup();

        it("should dispose the component", function() {
            const { sandbox, target } = this;
            const component = {
                cmp: {
                    dispose: sandbox.stub(),
                },
            };
            target.dispose(null, component);
        });
    });
});
