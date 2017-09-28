const EC2 = require('./EC2')
const { Ground,ShaderMaterial,Texture } = require('./def')
/*
working on that shit to make JSX work
const VPC = ({position, ec2},) => (
    <ground
        name={'ground1-vpc'}
        width={0.5 * 20}
        height={0.5 * 20}
        subdivisions={1}
        position={position}
    >
        <shaderMaterial
            name='vpc-tile'
            attributes={['position', 'uv']}
            uniforms={['worldViewProjection', 'boxSize', 'width', 'height', 'edgeColor', 'hue']}
            parentPropName='material'
            width={0.5 * 20}
            height={0.5 * 20}
            boxSize={0.5}
            edgeColor={[0, 0, 0, 1.0]}
            hue={[0.4, 0.4, 0.4, 1]}
            shaderPath={'/assets/shaders/tile'}
        >
            <texture parentPropName="tileTex" url={'/assets/textures/vpc-tile.png'} />
        </shaderMaterial>
        {EC2({position: [2, 2.1, 3]})}
    </ground>
);
*/
const VPC = ({ position, ec2s }) =>
    Ground(
        {
            name: 'ground1-vpc',
            width: 0.5 * 20,
            height: 0.5 * 20,
            subdivisions: 1,
            position: position,
        },
        [
            ShaderMaterial(
                {
                    attributes: ['position', 'uv'],
                    uniforms: [
                        'worldViewProjection',
                        'boxSize',
                        'width',
                        'height',
                        'edgeColor',
                        'hue',
                    ],
                    parentPropName: 'material',
                    width: 0.5 * 20,
                    height: 0.5 * 20,
                    boxSize: 0.5,
                    edgeColor: [0, 0, 0, 1.0],
                    hue: [0.4, 0.4, 0.4, 1],
                    name: 'vpc-tile',
                    shaderPath: '/assets/shaders/tile',
                },
                [
                    Texture({
                        parentPropName: 'tileTex',
                        url: '/assets/textures/vpc-tile.png',
                    }),
                ]
            ),
        ]
            // .concat(ec2s.map((ec2, index) => ({})))
            .concat(
                ec2s
                    ? [
                          EC2({ position: { start: [2, -0.01, 1], end: [2, 0.2, 1] } }),
                          EC2({ position: { start: [2, -0.01, 2], end: [2, 0.2, 2] } }),
                          EC2({ position: { start: [2, -0.01, 3], end: [2, 0.2, 3] } }),
                          EC2({ position: { start: [2, -0.01, 4], end: [2, 0.2, 4] } }),
                          EC2({ position: { start: [3, -0.01, 1], end: [3, 0.2, 1] } }),
                          EC2({ position: { start: [3, -0.01, 2], end: [3, 0.2, 2] } }),
                          EC2({ position: { start: [3, -0.01, 3], end: [3, 0.2, 3] } }),
                          EC2({ position: { start: [3, -0.01, 4], end: [3, 0.2, 4] } }),
                          EC2({ position: { start: [4, -0.01, 1], end: [4, 0.2, 1] } }),
                          EC2({ position: { start: [4, -0.01, 2], end: [4, 0.2, 2] } }),
                          EC2({ position: { start: [4, -0.01, 3], end: [4, 0.2, 3] } }),
                          EC2({ position: { start: [4, -0.01, 4], end: [4, 0.2, 4] } }),
                      ]
                    : []
            )
    );
module.exports = VPC;
