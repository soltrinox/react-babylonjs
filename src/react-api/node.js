class Node {
    // Stores all the children

    constructor(root, props) {
        DEBUG("@@Node.constructor");
        this.root = root;
        this.props = props;
        this.children = [];
    }

    appendChild(child) {
        DEBUG("@@Node.appendChild", { child });
        this.children.push(child);
    }

    removeChild(child, a, b) {
        DEBUG("@@Node.removeChild", { child, a, b });
        const index = this.children.indexOf(child);
        this.children.slice(index, 1);
    }
}

module.exports = Node;
