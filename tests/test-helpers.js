const includeComponentExportTests = (setup, opts) => {
    describe("exports", function() {
        setup();

        const { type } = opts;

        it("should export a type", function() {
            expect(this.target)
                .to.have.property("type")
                .to.be.a("string")
                .to.be.equals(type);
        });

        it("should export createComponent", function() {
            expect(this.target)
                .to.have.property("createComponent")
                .to.be.a("function");
        });

        it("should export props", function() {
            expect(this.target)
                .to.have.property("props")
                .to.be.an("object");
        });
    });
};

module.exports = {
    includeComponentExportTests,
};
