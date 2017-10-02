class Node {
    constructor(tagName, engine, scene) {
        this.engine = engine;
        this.scene = scene;
        this.tagName = tagName;
        this.children = [];
        this.props = {};
    }

    addChild(item) {
        this.children.push(item);
        item.parent = this;
    }

    addChildAt(item) {
        this.addChild(item);
    }

    getChildIndex(child) {
        return this.children.indexOf(child);
    }

    getChildAt() {
        throw new Error(`Method's not implemented`);
    }

    removeChild(item) {
        while (item.children.length > 0) item.removeChild(item.children[item.children.length - 1]);

        const index = this.children.indexOf(item);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
        if (item.dispose) {
            item.dispose();
        }
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    dispose() {
        const cmp = this.babylonCMP;
        if (cmp) {
            this.babylonCMP = null;
            cmp.dispose();
        }
    }
}

class NodeBabylon extends Node {}

module.exports = {
    Node,
    NodeBabylon,
};
