const Rx = require('rxjs');
const def = require('./def');
const BABYLON = require('babylonjs');
const snabbdom = require('snabbdom');
const snabbdom_props = require('snabbdom/modules/props');
const nodeTypes = def.createNodes(def.allDefs);
const { Node } = def;
const VPC = require('./VPC');
const { DefaultCameraKeyboardMoveInput, DefaultCameraMouseZoomInput } = require('./camera-inputs');

class BabylonSceneAPI {
    constructor(canvas, engine) {
        this._loopStarted = false;
        this.canvas = canvas;
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        window.BABYLON = BABYLON;
        this.scene.debugLayer.show({
            initialTab: 2,
            newColors: {
                backgroundColor: '#eee',
                backgroundColorLighter: '#fff',
                backgroundColorLighter2: '#fff',
                backgroundColorLighter3: '#fff',
                color: '#333',
                colorTop: 'red',
                colorBottom: 'blue',
            },
        });
    }

    startRenderLoop() {
        if (this._loopStarted) {
            return;
        }

        this.engine.runRenderLoop(() => this.scene.render());
    }

    createElement(tagName) {
        // console.log({ tagName });
        const fn = nodeTypes[tagName];
        if (!fn) {
            throw new Error(`<${tagName}> has not a creator function`);
        }
        return fn(this.canvas, this.engine, this.scene);
    }

    createElementNS(ns, tagName) {
        return nodeTypes[tagName](this.canvas, this.engine, this.scene);
    }

    appendChild(node, child) {
        node.addChild(child);
    }

    removeChild(node, child) {
        node.removeChild(child);
    }

    insertBefore(parentNode, newNode, referenceNode) {
        if (referenceNode) {
            const i = parentNode.getChildIndex(referenceNode);
            parentNode.addChildAt(newNode, i);
        } else {
            parentNode.addChild(newNode);
        }
    }

    parentNode(node) {
        return node.parent;
    }

    nextSibling(node) {
        if (!node.parent) {
            return null;
        }

        const parent = node.parent;
        const i = parent.getChildIndex(node);
        const sublingIndex = i + 1;

        if (parent.children.length <= sublingIndex) {
            return null;
        }

        return parent.getChildAt(sublingIndex);
    }

    tagName(node) {
        return node.tagName;
    }
}
const LOAD = () => {
    const canvasEl = document.querySelector('#renderCanvas');
    const engine = new BABYLON.Engine(canvasEl, true);

    const babylonSceneAPI = new BabylonSceneAPI(canvasEl, engine);
    window.addEventListener('resize', function() {
        engine.resize();
    });
    const myModule = {
        // pre: (...args) => console.log('pre=>', args),
        // create: (...args) => console.log('create=>', ...args),
        // update: (...args) => console.log('update=>', args),
        destroy: (...args) => console.log('MODULE.destroy=>', args),
        // post: (...args) => console.log('post=>', args),
        remove: (vnode, cb) => {
            console.log('MODULE.remove=>', [vnode, cb]);
            cb();
        },
    };

    const patch = snabbdom.init([snabbdom_props.propsModule, myModule], babylonSceneAPI);
    const parentContainer = new Node('app');
    const container = new Node('root');

    parentContainer.addChild(container);

    const Sky = (
        <box name="skybox" size={1000} infiniteDistance={true}>
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

    const ScenarioGround = (
        <ground name="ground1" width={2000} height={2000} subdivisions={2} position={[0, 0, 0]}>
            <parentProp name="material">
                <shaderMaterial
                    name="ground1-tile"
                    attributes={['position', 'uv']}
                    uniforms={[
                        'worldViewProjection',
                        'boxSize',
                        'width',
                        'height',
                        'edgeColor',
                        'hue',
                    ]}
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
    const frameRatePerSec = 50;
    const duration = 1000;
    const total = frameRatePerSec * duration / 1000;
    const y = { from: 1, to: 5 };
    const z = { from: -2, to: -16 };

    const time = Rx.Observable.interval(1000 / frameRatePerSec, Rx.Scheduler.queue).take(total + 1);
    const defaultCameraKeyboardMoveInput = new DefaultCameraKeyboardMoveInput();
    const defaultCameraMouseZoomInput = new DefaultCameraMouseZoomInput();

    const calcAxis = axis => {
        const delta = (axis.to - axis.from) / total;
        return i => i * delta + axis.from;
    };

    const calcZ = calcAxis(z);
    const calcY = calcAxis(y);
    const ec2AreVisible$ = Rx.Observable
        .timer(duration + 5500)
        .mapTo(false)
        .take(0)
        .startWith(true);

    const tmp = time
        .combineLatest(ec2AreVisible$, (i, ec2AreVisible) => ({ i, ec2AreVisible }))
        .map(({ i, ec2AreVisible }) => ({
            y: calcY(i),
            z: calcZ(i),
            ec2AreVisible,
        }))
        .map(({ z, y, ec2AreVisible }) => (
            <scene clearColor={[0, 0, 0]}>
                <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
                <freeCamera
                    name="camera1"
                    position={[0, y, z]}
                    defaultTarget={[0, 0, 1]}
                    inputs={[defaultCameraKeyboardMoveInput, defaultCameraMouseZoomInput]}
                >
                    <fxaaPostProcess
                        options={1}
                        samplingMode={BABYLON.Texture.TRILINEAR_SAMPLINGMODE}
                    />
                </freeCamera>
                {Sky}
                {ScenarioGround}
                {VPC({ position: [0, 1, 0], ec2s: ec2AreVisible })}
            </scene>
        ))
        .distinct()
        .share();

    // starting the renderLoop, just once
    tmp.take(1).subscribe(() => {
        LOG = true;
        babylonSceneAPI.startRenderLoop();
    });

    // render every time something is emitted
    tmp.scan(patch, container).subscribe(
        a => {
            // console.log({ a });
        },
        e => console.error(e),
        c => console.log({ c })
    );
};
LOAD();
