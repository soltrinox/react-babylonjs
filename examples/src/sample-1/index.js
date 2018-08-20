import React from "react";

import GroundGrid from "../components/ground-grid";
import SkyNebule from "../components/sky-nebule";

class Sample1 extends React.Component {
    doublePickTrigger(evt) {
        console.log("OnDoublePickTrigger", { evt });
    }
    render() {
        return [
            <freeCamera
                key="camera"
                position={[0, 5, -16]}
                defaultTarget={[0, 0, 0]}
                attachControl={true}
            />,

            <hemisphericLight
                key="light"
                name="light1"
                target={[0, 1, 0]}
                intensity={0.5}
            />,

            <SkyNebule key="top" size={1000} />,

            <GroundGrid key="bottom" />,

            <sphere
                key="sphere-0"
                position={[3, 5, 0]}
                segments={16}
                diameter={2}
                actionManager={{
                    OnPickTrigger: evt => console.log("picked", evt),
                    OnDoublePickTrigger: this.doublePickTrigger,
                }}
            />,
        ];
    }
}

export default Sample1;
