describe('babylon-scene-api', function() {
    const { createBabylonSceneAPI, ErrorInvalidChildrenType } = require('../src/babylon-scene-api');

    it('should not initialize paramaters are not provided', () => {
        const expectedError =
            'Invalid paramaters, you need to provide a single parameter:\n{BABYLON, canvas, engine, scene}';
        expect(createBabylonSceneAPI).to.throw(expectedError);
    });

    it('should initialize and have the required methods', () => {
        const api = createBabylonSceneAPI({ BABYLON: {}, canvas: {}, engine: {}, scene: {} });

        expect(api)
            .to.an('object')
            .to.have.all.keys([
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
            ]);
    });

    describe('methods', function() {
        before(function() {
            this.api = createBabylonSceneAPI({ BABYLON: {}, canvas: {}, engine: {}, scene: {} });
        });

        it('createTextNode should throw an Error', function() {
            expect(this.api.createTextNode).to.throw(ErrorInvalidChildrenType);
        });
    });
});
