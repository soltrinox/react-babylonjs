const BABYLON = require('babylonjs');

const Sky = values =>
    hh('box', values, [
        hh('parentProp', { props: { name: 'material' } }, [
            hh(
                'standardMaterial',
                {
                    props: {
                        name: 'skyboxMaterial',
                        backFaceCulling: false,
                        diffuseColor: [0, 0, 0],
                        specularColor: [0, 0, 0],
                    },
                },
                [
                    hh('parentProp', { props: { name: 'reflectionTexture' } }, [
                        hh('cubeTexture', {
                            props: {
                                url: 'assets/textures/nebula',
                                coordinatesMode: BABYLON.Texture.SKYBOX_MODE,
                            },
                        }),
                    ]),
                ]
            ),
        ]),
    ]);

module.exports = Sky;
