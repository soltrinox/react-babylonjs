describe('babylon-scene-api', function() {
    const { createBabylonSceneAPI } = require('../src/babylon-scene-api');

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
                'appendChild',
                'createElement',
                'createElementNS',
                'insertBefore',
                'nextSibling',
                'parentNode',
                'removeChild',
                'tagName',
                'patch',
            ]);
    });
});
