const { fullPath, caption } = getTargetName(__filename);

const setup = () =>
    setupTest(caption, require(fullPath), { mocksToEnable: [] });

describe(caption, function() {
    describe("exports", function() {
        setup();

        it("should export a function", function() {
            expect(this.target).to.be.a("function");
        });
    });

    describe("create", function() {
        setup();
        const props = { a: 1, b: 2 };
        const myType = "my-type";

        it("should create an node", function() {
            this.node = new this.target(myType, props);
            expect(this.node).to.be.an("object");
        });

        it("should have a property named [type]", function() {
            expect(this.node)
                .to.have.property("type")
                .to.be.equals(myType);
        });

        it("should have a property named [props]", function() {
            expect(this.node)
                .to.have.property("props")
                .to.be.equals(props);
        });

        it("should not create if type is not a string", function() {
            expect(() => this.target({})).to.throws(
                "invalid type of Node [object]"
            );

            expect(() => this.target()).to.throws(
                "invalid type of Node [undefined]"
            );
        });

        it("should not create if props is not a object", function() {
            expect(() => this.target("my-type", "")).to.throws(
                "invalid type of props [string]"
            );
        });
    });

    describe("append", function() {
        setup();

        before(function() {
            this.node = new this.target("my-type");
            this.childNode = new this.target("my-type");
        });

        it("should append a child node", function() {
            this.node.appendChild(this.childNode);
        });

        it("should have an item in the property children", function() {
            expect(this.node)
                .to.have.property("children")
                .to.eqls([this.childNode]);
        });

        it("should have a property parent in the child node", function() {
            expect(this.childNode)
                .to.have.property("parent")
                .to.equals(this.node);
        });
    });

    describe("removeChild", function() {
        setup();

        it("should remove a node without child", function() {
            const node = new this.target("my-type");
            const childNode = new this.target("my-type");
            node.appendChild(childNode);

            node.removeChild(childNode);

            expect(node.children).to.eqls([]);
        });

        it("should call dispose", function() {
            const { sandbox } = this;
            const node = new this.target("my-type");
            const childNode = new this.target("my-type");
            node.appendChild(childNode);

            sandbox.spy(childNode, "dispose");
            node.removeChild(childNode);
            sinon.assert.calledOnce(childNode.dispose);
        });

        it("should work even if child doesn't have dispose", function() {
            const node = new this.target("my-type");
            const childNode = new this.target("my-type");
            delete childNode.dispose;
            node.appendChild(childNode);
            node.removeChild(childNode);
        });

        it("should remove a node child recursively", function() {
            const { sandbox } = this;
            const node = new this.target("my-type");
            const childNode0 = new this.target("my-type");
            const childNode1 = new this.target("my-type");
            node.appendChild(childNode0);
            childNode0.appendChild(childNode1);

            sandbox.spy(childNode0, "removeChild");

            node.removeChild(childNode0);

            sinon.assert.calledOnce(childNode0.removeChild);

            expect(node.children).to.eqls([]);
            expect(childNode0.children).to.eqls([]);
        });
    });

    describe("dispose", function() {
        setup();

        it("should dispose", function() {
            const node = new this.target("my-type");
            node.dispose();
        });

        it("should call cmp dispose", function() {
            const { sandbox } = this;
            const node = new this.target("my-type");
            node.cmp = sandbox.stub({ dispose: () => {} });
            node.dispose();
            sinon.assert.calledOnce(node.cmp.dispose);
        });

        it("should only call cmp.dispose if it exsits", function() {
            const node = new this.target("my-type");
            node.cmp = {};
            node.dispose();
        });
    });
});
