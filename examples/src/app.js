import { hot } from "react-hot-loader";

import React from "react";

import GroundGrid from "./components/ground-grid";
import SkyNebule from "./components/sky-nebule";
import { mat01, mat02 } from "./materials";

class App extends React.Component {
    render() {
        return (
            <scene clearColor={[1, 1, 1]} ambientColor={[1, 0, 0]}>
                <freeCamera
                    position={[0, 5, -16]}
                    defaultTarget={[0, 0, 0]}
                    attachControl={true}
                />

                <hemisphericLight
                    name="light1"
                    target={[0, 1, 0]}
                    intensity={0.5}
                />

                <SkyNebule size={1000} />

                <GroundGrid />

                <sphere
                    key="sphere-0"
                    position={[3, 5, 0]}
                    segments={16}
                    diameter={2}
                />

                <sphere
                    key="sphere-1"
                    position={[-7, 5, 0]}
                    segments={16}
                    diameter={2.5}
                    material={mat01}
                />
            </scene>
        );
    }
}

export default hot(module)(App);
