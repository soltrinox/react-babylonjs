const { fullPath, caption } = getTargetName(__filename);

const setup = () => setupTest(caption, require(fullPath));

describe(caption, function() {
    describe("clone", function() {
        setup();

        [
            {},
            [1, 2],
            { a: 1, b: "asres", d: new Date() },
        ].forEach((objToClone, index) => {
            it(`fixture #${index}`, function() {
                const result = this.target.clone(objToClone);
                expect(objToClone).not.equals(result);
                expect(objToClone).eqls(result);
            });
        });
    });

    describe("equals", function() {
        setup();

        [
            { a: 1, b: 1, r: true },
            { a: [1], b: [1], r: true },
            { a: [1, 1], b: [1], r: false },
            { a: [2], b: [1], r: false },
            { a: {}, b: {}, r: true },
            { a: { a1: false }, b: {}, r: false },
            { a: { a1: false }, b: { a1: false }, r: true },
            { a: { a1: {} }, b: { a1: { a: true } }, r: false },
        ].forEach(({ a, b, r }, index) => {
            it(`fixture #${index}`, function() {
                expect(this.target.equals(a, b)).equals(r);
            });
        });
    });
});
