const immutable = require('immutable');
const { interval } = require('rxjs/observable/interval');
const { map, take } = require('rxjs/operators');

const BABYLON = require('babylonjs');
const React = require('react');
const { reactApi: { Node, BabylonJSRenderer } } = require('react-babylonjs-3d');

const ComponentContainer1 = 'COMPONENT-CONTAINER-1';
const ComponentContainer2 = 'COMPONENT-CONTAINER-2';
const View1 = 'VIEW-1';
const View2 = 'VIEW-2';
const View0 = 'VIEW-0';

class CameraApp extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            position: [0, 5, -10],
            target: [0, 0.2, 0],
            key: 1,
        };
    }

    componentDidMount() {
        DEBUG('COMPONENTDIDMOUNT');

        interval(1500)
            .take(1)
            .map(() => this.state.position)
            .map(([x, y, z]) => [x, y + 1, z])
            .subscribe(position => {
                const GROUP = 'Changing state position.y';
                DEBUG_START_GROUP(GROUP);
                this.setState({ position }, () => DEBUG_END_GROUP(GROUP));
            });

        interval(3500)
            .take(1)
            .map(() => this.state.position)
            .map(([x, y, z]) => [x, y, z])
            .subscribe(position => {
                const GROUP = 'setting state without any change at all';
                DEBUG_START_GROUP(GROUP);
                this.setState({ position }, () => DEBUG_END_GROUP(GROUP));
            });

        interval(5500)
            .take(1)
            .map(() => this.state.key)
            .map(key => key + 1)
            .subscribe(key => {
                const GROUP = 'change the key value';
                DEBUG_START_GROUP(GROUP);
                this.setState({ key }, () => DEBUG_END_GROUP(GROUP));
            });
    }

    render() {
        return (
            <freeCamera
                key={this.state.key}
                name="camera1"
                position={this.state.position}
                target={this.state.target}
                ref={camera => {
                    console.log(`camera=>`, camera);
                    console.log(`this.camera=>`, this.camera);
                    this.camera = camera;
                }}
            />
        );
    }
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            spheres: [
                { show: true, position: [-3, 1, 0], diameter: 2, subdivisions: 16, key: 30 },
                { show: true, position: [0, 1, 0], diameter: 2, subdivisions: 16, key: 31 },
                { show: true, position: [3, 1, 0], diameter: 2, subdivisions: 16, key: 32 },
            ],
        };
        this.remove = this.remove.bind(this);
        this.incDiameter = this.incDiameter.bind(this);
    }
    componentDidMount() {
        console.log('COMPONENTDIDMOUNT');
        /*Rx.Observable
            .interval(1000)
            .take(2)
            .scan(y => y + 0.1, this.state.y)
            .subscribe(y => {
                console.log('===========================');
                this.setState({ y });
            });*/

        /*Rx.Observable
            .interval(300)
            .take(3)
            .map(i => ({ key: i, x: i + 1 }))
            .map(props => Object.assign({}, props, { x: props.x * 3 - 6 }))
            .subscribe(({ key, x }) => {
                DEBUG_START_GROUP({ key });
                this.setState(
                    { spheres: this.state.spheres.concat({ key, position: [x, 1, 0] }) },
                    () => DEBUG_END_GROUP({ key })
                );
                // this.setState({ spheres: this.state.spheres.slice(0, -1) });
            });*/
    }
    remove(e) {
        console.log(e);
        const id = parseInt(e.source.id.split('-').pop());
        console.log({ id });
        console.log(this.setState({ spheres: this.state.spheres.filter(({ key }) => key !== id) }));
    }
    incDiameter() {
        const add = 1;
        const index = 0;
        const { spheres } = this.state;
        spheres[index].diameter += add;
        this.setState({
            spheres,
        });
    }
    render() {
        return (
            <View0>
                <View1>
                    <hemisphericLight
                        key="hemisphericLight"
                        name="light1"
                        target={[0, 1, 0]}
                        intensity={0.5}
                    />
                    {this.state.spheres
                        .filter(i => i.show === true)
                        .map(({ position, key, diameter, subdivisions }, index) => (
                            <sphere
                                on={{
                                    // pickTrigger: this.remove,
                                    pickTrigger: this.incDiameter,
                                }}
                                name={`sphere-${key}`}
                                key={key}
                                position={position}
                                subdivisions={subdivisions}
                                diameter={diameter}
                            />
                        ))}
                    <ground key="ground" name="ground1" width={6} depth={6} subdivisions={2} />
                    <CameraApp key="camera" />
                </View1>
            </View0>
        );
    }
}

class SimpleApp extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            spheres: immutable.List([
                immutable.Map({
                    show: true,
                    position: [3, 5, 0],
                    diameter: 2,
                    segments: 16,
                    key: 30,
                }),
            ]),
            camera: {
                key: 'camera-1',
                position: [0, 5, -10],
                target: [0, 0.1, 0],
            },
        };
    }
    componentDidMount() {
        /*interval(1000)
            .pipe(
                take(3),
                map(i =>
                    this.state.spheres.update(0, item =>
                        item.update('position', ([x, y, z]) => [x + i/10, y, z])
                    )
                )
            )
            .subscribe(spheres => {
                DEBUG_START_GROUP('spheres');
                this.setState({ spheres }, () => DEBUG_END_GROUP('spheres'));
            });*/
    }
    render() {
        return (
            <View0>
                <freeCamera
                    key={this.state.camera.key}
                    name="camera1"
                    position={this.state.camera.position}
                    target={this.state.camera.target}
                />
                {this.state.spheres.map((sphere, index) => {
                    const [position, key, diameter, segments] = [
                        'position',
                        'key',
                        'diameter',
                        'segments',
                    ].map(sphere.get.bind(sphere));
                    console.log({ position });
                    return (
                        <sphere
                            name={`sphere-${key}`}
                            key={key}
                            position={position}
                            segments={segments}
                            diameter={diameter}
                        />
                    );
                })}
            </View0>
        );
    }
}
class App1 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            i: 0,
        };
        /*const interval = setInterval(() => {
            console.log({ i });
            i++;
            this.setState({ i: this.state.i + 1 });
            if (i >= 1) {
                clearInterval(interval);
            }
        }, 2000);*/
    }

    render() {
        return (
            <ComponentContainer1 key="Key-Container-1" valueProp={11}>
                <View key="Key-View-1" number={11} valueOfI={this.state.i} />
                <View key="Key-View-2" number={12} valueOfI={this.state.i} />
                <View key="Key-View-3" number={13} valueOfI={this.state.i} />
            </ComponentContainer1>
        );
    }
}

const App2 = () => [
    <ComponentContainer1 key="1" valueProp={22}>
        <View1 number={22} />
    </ComponentContainer1>,
    <ComponentContainer2 key="2" valueProp={33}>
        <View2 number={33} />
    </ComponentContainer2>,
];

module.exports = { App, App1, App2, SimpleApp };
