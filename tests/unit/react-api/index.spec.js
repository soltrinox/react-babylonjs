const { fullPath, caption } = getTargetName(__filename);

const setup = () =>
    setupTest(caption, require(fullPath), { mocksToEnable: [] });

describe(caption, function() {
    describe("exports", function() {
        setup();

        it("should export a object called BabylonJSRenderer", function() {
            expect(this.target)
                .to.be.an("object")
                .to.have.property("babylonJSRenderer")
                .to.be.an("object");
        });

        it("should export a function called Node", function() {
            expect(this.target)
                .to.be.an("object")
                .to.have.property("Node")
                .to.be.a("function");
        });
    });
});
