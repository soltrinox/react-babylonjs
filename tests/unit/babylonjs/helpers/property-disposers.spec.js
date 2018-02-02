const { fullPath, caption } = getTargetName(__filename);

const setup = () => setupTest(caption, require(fullPath));

describe(caption, function() {
    setup();

    it("should not dispose nor setter if lastValue is undefined", function() {
        const component = "123";
        const lastValue = undefined;
        const setter = this.sandbox.stub();
        this.target.component(component, lastValue, setter);

        sinon.assert.notCalled(setter);
    });

    it("should call setter", function() {
        const component = "123";
        const lastValue = this.sandbox.stub({ dispose: () => {} });
        const setter = this.sandbox.stub();
        this.target.component(component, lastValue, setter);

        sinon.assert.calledOnce(setter);
        sinon.assert.calledWithExactly(setter, component, undefined);
    });

    it("should dispose lastValue", function() {
        const component = "123";
        const lastValue = this.sandbox.stub({ dispose: () => {} });
        const setter = this.sandbox.stub();
        this.target.component(component, lastValue, setter);

        sinon.assert.calledOnce(lastValue.dispose);
        sinon.assert.calledWithExactly(lastValue.dispose);
    });
});
