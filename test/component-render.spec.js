const { createApp, hh } = require('../src/component');

const createStubApi = sandbox =>
    sandbox.stub({
        createRootElement: () => {},
        patch: () => {},
    });

describe('COMPONENT RENDER', function() {
    before(function() {
        this.sandbox = sinon.sandbox.create();
        this.api = createStubApi(this.sandbox);
    });

    after(function() {
        this.sandbox.restore();
    });

    it('should not render if no vtree is provided', function() {
        const expectedError = 'Invalid paramaters, you need a vtree.';
        const app = createApp({ api: this.api });
        expect(app.render).to.throw(expectedError);
    });
});

describe('WHEN RENDER', function() {
    before(function() {
        this.sandbox = sinon.sandbox.create();
        this.api = createStubApi(this.sandbox);

        this.app = createApp({ api: this.api });

        this.rootElement = Symbol('ROOT-ELEMEMT');
        this.vtree = hh('box', { size: 8 });

        this.api.createRootElement.onCall(0).returns(this.rootElement);

        this.patchReturns = [Symbol('1'), Symbol('2')];
        this.patchReturns.forEach((value, i) => this.api.patch.onCall(i).returns(value));
    });

    after(function() {
        this.sandbox.restore();
    });

    describe('FIRST RENDER', function() {
        before(function() {
            this.sandbox.resetHistory();
        });

        it('should render', function() {
            this.app.render(this.vtree);
        });

        it('should create a root element', function() {
            sinon.assert.calledOnce(this.api.createRootElement);
        });

        it('should call patch with the root element and the vtree', function() {
            sinon.assert.calledOnce(this.api.patch);
            sinon.assert.calledWithExactly(this.api.patch, this.rootElement, this.vtree);
        });
    });

    describe('SECOND RENDER', function() {
        before(function() {
            this.sandbox.resetHistory();
        });

        it('should allow to call render more than once', function() {
            this.app.render(this.vtree);
        });

        it('should not call createRootElement', function() {
            sinon.assert.notCalled(this.api.createRootElement);
        });

        it('should call patch', function() {
            sinon.assert.calledOnce(this.api.patch);
            sinon.assert.calledWithExactly(this.api.patch, this.patchReturns[0], this.vtree);
        });
    });
});
