const ScenarioGround = values =>
    hh('ground', values, [
        hh('parentProp', { props: { name: 'material' } }, [
            hh(
                'shaderMaterial',
                {
                    props: {
                        name: 'ground1-tile',
                        attributes: ['position', 'uv'],
                        uniforms: [
                            'worldViewProjection',
                            'boxSize',
                            'width',
                            'height',
                            'edgeColor',
                            'hue',
                        ],
                        width: 2000,
                        height: 2000,
                        boxSize: 0.5,
                        edgeColor: [0, 0, 0, 1.0],
                        hue: [0.3, 0.3, 0.3, 1.0],
                        shaderPath: '/assets/shaders/groundTile',
                    },
                },
                [
                    hh('parentProp', { props: { name: 'tileTex' } }, [
                        hh('texture', {
                            props: {
                                url: '/assets/textures/vpc-tile.png',
                            },
                        }),
                    ]),
                ]
            ),
        ]),
    ]);

module.exports = ScenarioGround;
