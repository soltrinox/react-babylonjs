/** @jsx hh */
const nodeTypes = createNodes(_allDefs);

class BabylonSceneAPI {
    constructor(canvas, engine) {
        this._loopStarted = false;
        this.canvas = canvas;
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        this.scene.debugLayer.show({
            popup: true,
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

    var patch = snabbdom.init([snabbdom_props.propsModule], babylonSceneAPI);
    const parentContainer = new Node('app');
    const container = new Node('All');
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
        <ground name={'ground1'} width={2000} height={2000} subdivisions={2} position={[0, 0, 0]}>
            <parentProp name="material">
                <shaderMaterial
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
                    name="ground1-tile"
                    shaderPath="/assets/shaders/groundTile"
                >
                    <parentProp name="tileTex">
                        <texture url="/assets/textures/vpc-tile.png" />
                    </parentProp>
                </shaderMaterial>
            </parentProp>
        </ground>
    );

    const time = Rx.Observable.interval(10, Rx.Scheduler.queue);

    const tmp = time
        .take(100)
        // .map(i => i * 0.01)
        .map(i => (
            <scene clearColor={[0, 1, 0]}>
                <hemisphericLight name="light1" target={[0, 1, 0]} intensity={0.5} />
                <freeCamera name="camera1" position={[0, 5, -10]} defaultTarget={[0, 0, 0]}>
                    <parent name="camera">
                        <fxaaPostProcess />
                    </parent>
                    <parentPropList name="inputs">
                        <defaultCameraMouseZoomInput />
                        <defaultCameraKeyboardMoveInput />
                    </parentPropList>
                </freeCamera>
                {Sky}
                {ScenarioGround}
                {VPC({ position: [-5, 1, 5], ec2s: true })}
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
        e => console.log({ e }),
        c => console.log({ c })
    );
};
LOAD();
