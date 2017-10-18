class Node {
  // Stores all the children

  constructor(root, props) {
    console.log('@@Node.constructor');
    this.root = root;
    this.props = props;
    this.children = [];
  }

  appendChild(child, a, b) {
    console.log('@@Node.appendChild', { child, a, b });
    this.children.push(child);
  }

  removeChild(child, a, b) {
    console.log('@@Node.removeChild', { child, a, b });
    const index = this.children.indexOf(child);
    this.children.slice(index, 1);
  }

  renderChildNode() {
    console.log('@@Node.renderChildNode');
    for (let i = 0; i < this.children.length; i += 1) {
      if (typeof this.children[i] === 'string') {
        this.adder.addText(this.children[i]);
      } else if (typeof this.children[i] === 'object') {
        this.children[i].render();
      }
    }
  }

  render() {
    console.log('@@Node.render');
    this.renderChildNode();
  }
}

module.exports = Node;