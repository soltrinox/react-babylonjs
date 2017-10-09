describe('babylon-scene-api', function() {
    const { createBabylonSceneAPI, ErrorInvalidChildrenType } = require('../src/babylon-scene-api');

    it('should not initialize paramaters are not provided', () => {
        const expectedError =
            'Invalid paramaters, you need to provide a single parameter:\n{BABYLON, canvas, engine, scene}';
        expect(createBabylonSceneAPI).to.throw(expectedError);
    });

    it('should initialize and have the required methods', () => {
        const api = createBabylonSceneAPI({ BABYLON: {}, canvas: {}, engine: {}, scene: {} });

        expect(api).to.be.an('object');

        [
            'createTextNode',
            'appendChild',
            'createElement',
            'createRootElement',
            'createElementNS',
            'insertBefore',
            'nextSibling',
            'parentNode',
            'removeChild',
            'tagName',
            'patch',
        ].forEach(propName => expect(api).to.have.property(propName));
    });

    describe('methods', function() {
        before(function() {
            this.canvas = Symbol('Canvas');
            this.engine = Symbol('Engine');
            this.scene = Symbol('Scene');
            this.api = createBabylonSceneAPI({
                BABYLON: {},
                canvas: this.canvas,
                engine: this.engine,
                scene: this.scene,
            });
        });

        it('canvas should be available', function() {
            expect(this.api.canvas).to.be.equals(this.canvas);
        });

        it('scene should be available', function() {
            expect(this.api.scene).to.be.equals(this.scene);
        });

        it('engine should be available', function() {
            expect(this.api.engine).to.be.equals(this.engine);
        });

        it('createTextNode should throw an Error', function() {
            expect(this.api.createTextNode).to.throw(ErrorInvalidChildrenType);
        });
    });
});
