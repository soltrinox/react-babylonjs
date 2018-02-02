const { fullPath, caption } = getTargetName(__filename);

const setup = () => setupTest(caption, require(fullPath));

describe(caption, function() {
    setup();

    [
        [
            "property",
            "cmpPropName",
            [{}, "a"],
            args1 => expect(args1[0]).eqls({ cmpPropName: "a" }),
        ],
        [
            "propertyFromComponent",
            "cmpPropName",
            [{}, { getComponent: () => "component-instance" }],
            args1 =>
                expect(args1[0]).eqls({
                    cmpPropName: "component-instance",
                }),
        ],
        [
            "propertyFromComponent",
            "cmpPropName",
            [{}, undefined],
            args1 => expect(args1[0]).eqls({ cmpPropName: undefined }),
        ],
        [
            "setFloat",
            "cmpPropName",
            [{ setFloat: sinon.stub() }, [1, 2, 3]],
            args1 => {
                sinon.assert.calledOnce(args1[0].setFloat);
                sinon.assert.calledWithExactly(
                    args1[0].setFloat,
                    "cmpPropName",
                    [1, 2, 3]
                );
            },
        ],
        [
            "setVector4",
            "cmpPropName",
            [{ setVector4: sinon.stub() }, [1, 2, 3, 4]],
            args1 => {
                sinon.assert.calledOnce(args1[0].setVector4);
                sinon.assert.calledWithExactly(
                    args1[0].setVector4,
                    "cmpPropName",
                    [1, 2, 3, 4]
                );
            },
        ],
        [
            "setTexture",
            "cmpPropName",
            [
                { setTexture: sinon.stub() },
                { getComponent: () => "component-instance" },
            ],
            args1 => {
                sinon.assert.calledOnce(args1[0].setTexture);
                sinon.assert.calledWithExactly(
                    args1[0].setTexture,
                    "cmpPropName",
                    "component-instance"
                );
            },
        ],
        [
            "setTexture",
            "cmpPropName",
            [{ setTexture: sinon.stub() }, "my-value"],
            args1 => {
                sinon.assert.calledOnce(args1[0].setTexture);
                sinon.assert.calledWithExactly(
                    args1[0].setTexture,
                    "cmpPropName",
                    args1[1]
                );
            },
        ],
    ].forEach(([propName, cmpPropName, args1, fn], index) => {
        it(`fixture #${propName} #${index}`, function() {
            this.target[propName](cmpPropName)(...args1);
            fn(args1);
        });
    });
    it("apply", function() {
        const value = this.sandbox.stub();
        const cmpPropName = "asdasds";
        this.target.apply(cmpPropName, value);
        sinon.assert.calledOnce(value);
        sinon.assert.calledWithExactly(value, cmpPropName);
    });
});
