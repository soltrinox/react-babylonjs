const React = require('react');
const ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');

function createElement(type, props, child) {
  return { type, props, child };
}

const BabylonJSRenderer = ReactFiberReconciler({
  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    console.log('createInstance', {
      type,
      props,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    });
    return createElement(type, props, rootContainerInstance);
  },

  getRootHostContext(container) {
    console.log('getRootHostContext', { container });
    return { myRootContext: 123 };
  },

  getChildHostContext(rootContext, type, container) {
    console.log('getChildHostContext', { rootContext, type, container });
    return {
      childHostContext: 'childddddd',
      host: { rootContext, type, container }
    };
  },

  appendInitialChild(parentInstance, child) {
    console.log('##appendInitialChild', { parentInstance, child });
    if (parentInstance.appendChild) {
      parentInstance.appendChild(child);
    } else {
      parentInstance.document = child;
    }
  },

  appendChild(parentInstance, child) {
    console.log('b');
    if (parentInstance.appendChild) {
      parentInstance.appendChild(child);
    } else {
      parentInstance.document = child;
    }
  },

  removeChild(parentInstance, child) {
    console.log('c');

    parentInstance.removeChild(child);
  },

  insertBefore(parentInstance, child, beforeChild) {
    console.log('c');
    // noop
  },

  // This is the final method which is called before flushing the root component to the host environment.
  finalizeInitialChildren(testElement, type, props, rootContainerInstance) {
    console.log('##finalizeInitialChildren', {
      testElement,
      type,
      props,
      rootContainerInstance
    });
    return false;
  },

  prepareUpdate(testElement, type, oldProps, newProps, hostContext) {
    console.log('c');
    return true;
  },

  commitUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    internalInstanceHandle
  ) {
    console.log('c');
    // noop
  },

  // This is called after initializeFinalChildren
  commitMount(
    instance,
    type,
    newProps,
    rootContainerInstance,
    internalInstanceHandle
  ) {
    console.log('c');
    // noop
  },

  getPublicInstance(inst) {
    console.log('c');
    return inst;
  },

  // These are necessary for any global side-effects that you need to produce in the host environment

  prepareForCommit() {
    console.log('INITIAL-prepareForCommit', this);
    // noop
  },

  resetAfterCommit() {
    console.log('FINAL-resetAfterCommit', this);
    // noop
  },

  // The following methods are for the specific text nodes. In our example, we don't have any specific text nodes so we return false or noop them

  shouldSetTextContent(props) {
    console.log('shouldSetTextContent', { props });
    return false;
  },

  resetTextContent(testElement) {
    console.log('c');
    // noop
  },

  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    console.log('c');
    return text;
  },

  commitTextUpdate(textInstance, oldText, newText) {
    console.log('c');
    textInstance.chidren = newText;
  },

  useSyncScheduling: true
});

module.exports = BabylonJSRenderer;