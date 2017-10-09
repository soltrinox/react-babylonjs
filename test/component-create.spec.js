describe('COMPONENT', function() {
    const { createApp } = require('../src/component');

    it('should not initialize without api', () => {
        const expectedError =
            'Invalid paramaters, you need to provide an object with a key named api:\n{ api: createBabylonSceneAPI(...) }';

        expect(createApp).to.throw(expectedError);
        expect(createApp, {}).to.throw(expectedError);
    });

    it('should create a app', () => {
        const app = createApp({
            api: {},
        });

        expect(app)
            .to.an('object')
            .to.have.all.keys(['render', 'dispose']);
    });
});
