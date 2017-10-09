const BABYLON = require('babylonjs');

const Camera = ({ position }) => (
    <freeCamera name="camera1" position={position} defaultTarget={[0, 0, 1]} inputs={[]}>
        <fxaaPostProcess options={1} samplingMode={BABYLON.Texture.TRILINEAR_SAMPLINGMODE} />
    </freeCamera>
);

Camera.defaultProps = {
    position: [0, 0, 0],
};
module.exports = Camera;
