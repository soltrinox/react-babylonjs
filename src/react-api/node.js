function Node(props) {
    // Stores all the children

    this.props = props;
    this.children = [];

    this.appendChild = function(child) {
        this.children.push(child);
        child.parent = this;
    };

    this.removeChild = function(child) {
        const index = this.children.indexOf(child);
        this.children.splice(index, 1);

        while (child.children.length > 0) {
            child.removeChild(child.children[child.children.length - 1]);
            n;
        }

        if (child.dispose) {
            child.dispose();
        }
    };

    this.dispose = function() {
        if (this.cmp && this.cmp.dispose) {
            this.cmp.dispose();
        }
    };
}

module.exports = Node;
