/** @jsx hhh */
const BABYLON = require('babylonjs');
const Sky = ({ size, infiniteDistance }) => (
    <box name="skybox" size={size} infiniteDistance={infiniteDistance}>
        <parentProp name="material">
            <standardMaterial
                name="skyboxMaterial"
                backFaceCulling={false}
                diffuseColor={[0, 0, 0]}
                specularColor={[0, 0, 0]}
            >
                <parentProp name="reflectionTexture">
                    <cubeTexture
                        url="assets/textures/nebula"
                        coordinatesMode={BABYLON.Texture.SKYBOX_MODE}
                    />
                </parentProp>
            </standardMaterial>
        </parentProp>
    </box>
);

Sky.defaultProps = { size: 1000, infiniteDistance: true };

module.exports = Sky;
