const DEBUG = () => {};

function Node(props) {
    // Stores all the children

    DEBUG("@@Node.constructor");
    this.props = props;
    this.children = [];

    this.appendChild = function(child) {
        this.children.push(child);
    };

    this.appendChild = function(child) {
        DEBUG("@@Node.appendChild", { child });
        this.children.push(child);
        child.parent = this;
    };

    this.removeChild = function(child) {
        DEBUG("@@Node.removeChild", { child });
        while (child.children.length > 0) {
            child.removeChild(child.children[child.children.length - 1]);
        }

        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
        if (child.dispose) {
            child.dispose();
        }
    };

    this.dispose = function() {
        DEBUG("@@Node.dispose");
        if (this.cmp && this.cmp.dispose) {
            this.cmp.dispose();
        }
    };
}

module.exports = Node;
