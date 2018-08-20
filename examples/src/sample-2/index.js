// https://www.babylonjs-playground.com/#165IV6#64
import React from "react";

class Sample2 extends React.Component {
    constructor() {
        super();

        const _radius = 1;
        const _deltaTheta = 0.1;
        const _deltaY = 0.005;

        this.state = {
            springLines: Array.from({ length: 400 }).map((_, i) => {
                const theta = (i + 1) * _deltaTheta;
                const y = (i + 1) * _deltaY;
                return [
                    _radius * Math.cos(theta),
                    y,
                    _radius * Math.sin(theta),
                ];
            }),
        };
    }

    render() {
        return (
            <scene>
                <arcRotateCamera
                    key="camera"
                    position={[5, 5, -5]}
                    target={[0, 0, 0]}
                    attachControl={true}
                    alpha={0}
                    beta={0}
                    radius={0}
                />

                <hemisphericLight
                    key="light"
                    name="light1"
                    target={[0, 1, 0]}
                />

                <lines
                    key="body"
                    points={this.state.springLines}
                    color={[1, 0, 1]}
                    actionManager={{
                        OnPickTrigger: evt => console.log("line pick=>", evt),
                    }}
                />
            </scene>
        );
    }
}

export default Sample2;
