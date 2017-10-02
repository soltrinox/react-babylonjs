const { createComponent, hh } = require('../src/component');

const createStubApi = sandbox =>
    sandbox.stub({
        createRootElement: () => {},
        patch: () => {},
    });

describe('COMPONENT RENDER', function() {
    const sandbox = sinon.sandbox.create();
    const api = createStubApi(sandbox);

    after(function() {
        sandbox.restore();
    });

    it('should not render if no vtree is provided', function() {
        const expectedError = 'Invalid paramaters, you need a vtree.';
        const component = createComponent({ api });
        expect(component.render).to.throw(expectedError);
    });
});

describe('WHEN RENDER', function() {
    const sandbox = sinon.sandbox.create();
    const api = createStubApi(sandbox);
    const component = createComponent({ api });

    const rootElement = Symbol('ROOT-ELEMEMT');
    const vtree = hh('box', { size: 8 });

    api.createRootElement.onCall(0).returns(rootElement);

    const patchReturns = [Symbol('1'), Symbol('2')];
    patchReturns.forEach((value, i) => api.patch.onCall(i).returns(value));

    after(function() {
        sandbox.restore();
    });

    describe('FIRST RENDER', function() {
        it('should render', function() {
            component.render(vtree);
        });

        it('should create a root element', function() {
            sinon.assert.calledOnce(api.createRootElement);
        });

        it('should call patch with the root element and the vtree', function() {
            sinon.assert.calledOnce(api.patch);
            sinon.assert.calledWithExactly(api.patch, rootElement, vtree);
        });
    });

    describe('SECOND RENDER', function() {
        it('should allow to call render more than once', function() {
            component.render(vtree);
        });

        it('should not call createRootElement', function() {
            sinon.assert.calledOnce(api.createRootElement);
        });

        it('should call patch', function() {
            sinon.assert.calledTwice(api.patch);
            sinon.assert.calledWithExactly(api.patch.getCall(1), patchReturns[0], vtree);
        });
    });
});
