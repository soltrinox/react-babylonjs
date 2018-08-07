import SkyNebule from "../components/sky-nebule";
import GroundGrid from "../components/ground-grid";
import { mat01 } from "../materials";

export default () => [
    <freeCamera
        key="sample4-freeCamera"
        position={[0, 5, -16]}
        defaultTarget={[0, 0, 0]}
        attachControl={true}
    />,

    <hemisphericLight
        key="sample4-hemisphericLight"
        name="light1"
        target={[0, 1, 0]}
        intensity={0.5}
    />,

    <SkyNebule key="sample4-SkyNebule" size={1000} />,

    <GroundGrid key="sample4-GroundGrid" />,

    <sphere
        key="sample4-sphere-0"
        position={[3, 5, 0]}
        segments={16}
        diameter={2}
    />,

    <sphere
        key="sample4-sphere-1"
        position={[-7, 5, 0]}
        segments={16}
        diameter={6.5}
        material={mat01}
    />,
];
