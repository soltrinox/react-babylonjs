const { fullPath, caption } = getTargetName(__filename);

const setup = () =>
    setupTest(caption, require(fullPath), { mocksToEnable: [] });

describe(caption, function() {
    describe("create", function() {
        setup();

        it("should export a method called create", function() {
            expect(this.target)
                .to.be.an("object")
                .to.have.property("create")
                .to.be.a("function");
        });

        it("should create", function() {
            this.target.create();
        });

        it("should return a new valid id", function() {
            const result = this.target.create().newId();
            expect(result)
                .to.be.a("string")
                .to.be.equals("1");
        });
    });

    describe("save", function() {
        setup();

        it("should throw an error on save if an id is not provided", function() {
            const result = this.target.create();
            expect(() => result.save()).to.throw("No id was provided");
        });

        it("should throw an error on save if the provided id is invalid", function() {
            const result = this.target.create();
            result.newId();
            expect(() => result.save("sds2")).to.throw("Invalid id");
            expect(() => result.save("2")).to.throw("Invalid id");
        });

        it("should save a component", function() {
            const result = this.target.create();
            const id = result.newId();
            result.save(id);
        });
    });

    describe("get", function() {
        setup();

        it("should throw an error if an id is not provided", function() {
            const result = this.target.create();
            expect(() => result.get()).to.throw("No id was provided");
        });

        it("should throw an error if the provided id is invalid", function() {
            const result = this.target.create();
            result.newId();
            expect(() => result.get("sds2")).to.throw("Invalid id");
            expect(() => result.get("2")).to.throw("Invalid id");
        });

        it("should return undefined if the component has not been set", function() {
            const result = this.target.create();
            const id = result.newId();
            expect(result.get(id)).to.be.undefined;
        });
    });

    describe("save and get", function() {
        setup();

        it("should return the saved component", function() {
            const result = this.target.create();
            const myComponent = Symbol({ a: "12" });
            const id = result.newId();
            result.save(id, myComponent);
            expect(result.get(id)).to.be.equals(myComponent);
        });

        it("should remove the saved component when save with undefined", function() {
            const result = this.target.create();
            const id = result.newId();

            result.save(id, { a: "12" });
            result.save(id, undefined);
            expect(result.get(id)).to.be.undefined;

            result.save(id, { a: "12" });
            result.save(id, null);
            expect(result.get(id)).to.be.undefined;

            result.save(id, { a: "12" });
            result.save(id);
            expect(result.get(id)).to.be.undefined;
        });
    });
});
