
const EC2 = ({ position }) => (
    <box
        name="ec2-box"
        options={{
            width: 0.5,
            depth: 0.5,
            height: 0.3,
        }}
        position={position}
        ellipsoid={[1, 1, 1]}
    >
        <parentProp name="material">
            <shaderMaterial
                attributes={['position', 'normal', 'uv']}
                uniforms={['worldViewProjection', 'boxColor', 'rotateTex']}
                name={'elb-shader'}
                shaderPath={'/assets/shaders/box'}
                boxColor={[213 / 255, 213 / 255, 213 / 255, 1.0]}
                edgeColor={[0, 0, 0, 1.0]}
                rotateTex={-90}
            >
                <parentProp name="textureSampler">
                    <texture url={'assets/textures/ec2.png'} />
                </parentProp>
            </shaderMaterial>
        </parentProp>
    </box>
);

module.exports = EC2
// TODO: ellipsoid is not working!!!
// {}

/*const EC2 = () =>
    Box(
        {
            name: 'ec2-box',
            options: {
                width: 0.5,
                depth: 0.5,
                height: 0.3,
            },
            position: [1, 0.7, 7],
        },
        [
            ShaderMaterial(
                {
                    parentPropName: 'material',
                    attributes: ['position', 'normal', 'uv'],
                    uniforms: ['worldViewProjection', 'boxColor', 'rotateTex'],
                    name: 'elb-shader',
                    shaderPath: '/assets/shaders/box',
                    boxColor: [213 / 255, 213 / 255, 213 / 255, 1.0],
                    edgeColor: [0, 0, 0, 1.0],
                    rotateTex: -90,
                    ellipsoid: [1, 1, 1],
                },
                [
                    Texture({
                        parentPropName: 'textureSampler',
                        url: 'assets/textures/ec2.png',
                    }),
                ]
            ),
        ]
    );
*/
