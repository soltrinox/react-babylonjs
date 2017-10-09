const ScenarioGround = () => (
    <ground name="ground1" width={2000} height={2000} subdivisions={2} position={[0, 0, 0]}>
        <parentProp name="material">
            <shaderMaterial
                name="ground1-tile"
                attributes={['position', 'uv']}
                uniforms={['worldViewProjection', 'boxSize', 'width', 'height', 'edgeColor', 'hue']}
                width={2000}
                height={2000}
                boxSize={0.5}
                edgeColor={[0, 0, 0, 1.0]}
                hue={[0.3, 0.3, 0.3, 1.0]}
                shaderPath="/assets/shaders/groundTile"
            >
                <parentProp name="tileTex">
                    <texture url="/assets/textures/vpc-tile.png" />
                </parentProp>
            </shaderMaterial>
        </parentProp>
    </ground>
);

module.exports = ScenarioGround;
