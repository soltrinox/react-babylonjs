describe('COMPONENT', function() {
    const { createComponent } = require('../src/component');

    it('should not initialize without api', () => {
        const expectedError =
            'Invalid paramaters, you need to provide an object with a key named api:\n{ api: createBabylonSceneAPI(...) }';

        expect(createComponent).to.throw(expectedError);
        expect(createComponent, {}).to.throw(expectedError);
    });

    it('should create a component', () => {
        const component = createComponent({
            api: {},
        });

        expect(component)
            .to.an('object')
            .to.have.all.keys(['render', 'dispose']);
    });
});
