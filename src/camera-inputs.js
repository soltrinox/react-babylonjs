'use strict';
const BABYLON = require('babylonjs');
const ZOOM_SENSITIVITY = 200;

class DefaultCameraKeyboardMoveInput {
    constructor() {
        this.keys = [];
        this.keysUp = [38];
        this.keysDown = [40];
        this.keysLeft = [37];
        this.keysRight = [39];
        this.keysPlus = [187];
        this.keysDash = [189];
    }

    getTypeName() {
        return 'DefaultCameraKeyboardMoveInput';
    }

    getSimpleName() {
        return 'keyboard';
    }

    attachControl(element, noPreventDefault) {
        const _this = this;
        if (!this.onKeyDown) {
            element.tabIndex = 1;
            this.onKeyDown = function(evt) {
                if (
                    _this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                    _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                    _this.keysPlus.indexOf(evt.keyCode) !== -1 ||
                    _this.keysDash.indexOf(evt.keyCode) !== -1
                ) {
                    let index = _this.keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        _this.keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this.onKeyUp = function(evt) {
                if (
                    _this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                    _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                    _this.keysPlus.indexOf(evt.keyCode) !== -1 ||
                    _this.keysDash.indexOf(evt.keyCode) !== -1
                ) {
                    let index = _this.keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        _this.keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            element.addEventListener('keydown', this.onKeyDown, false);
            element.addEventListener('keyup', this.onKeyUp, false);
            BABYLON.Tools.RegisterTopRootEvents([{ name: 'blur', handler: this.onLostFocus }]);
        }
    }

    detachControl(element) {
        if (this.onKeyDown) {
            element.removeEventListener('keydown', this.onKeyDown);
            element.removeEventListener('keyup', this.onKeyUp);
            BABYLON.Tools.UnregisterTopRootEvents([{ name: 'blur', handler: this.onLostFocus }]);
            this.keys = [];
            this.onKeyDown = null;
            this.onKeyUp = null;
        }
    }

    checkInputs() {
        if (this.onKeyDown) {
            let camera = this.camera;

            for (var index = 0; index < this.keys.length; index++) {
                let keyCode = this.keys[index];
                let speed = camera._computeLocalCameraSpeed();
                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(-speed, 0, 0);
                } else if (this.keysUp.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, speed, 0);
                } else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(speed, 0, 0);
                } else if (this.keysDown.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, -speed, 0);
                } else if (this.keysPlus.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, 0, speed);
                } else if (this.keysDash.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, 0, -speed);
                }

                if (camera.getScene().useRightHandedSystem) {
                    camera._localDirection.z *= -1;
                }

                camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                BABYLON.Vector3.TransformNormalToRef(
                    camera._localDirection,
                    camera._cameraTransformMatrix,
                    camera._transformedDirection
                );

                if (
                    this.keysPlus.indexOf(keyCode) === -1 &&
                    this.keysDash.indexOf(keyCode) === -1
                ) {
                    camera._localDirection.multiplyInPlace(new BABYLON.Vector3(1, 1, 0));
                    camera._transformedDirection.y = 0;
                }

                camera.cameraDirection.addInPlace(camera._transformedDirection);
            }
        }
    }

    onLostFocus() {
        this.keys = [];
    }
}

class DefaultCameraMouseZoomInput {
    constructor() {
        this.observer = null;
        this.wheelZoom = this.wheelZoom.bind(this);
        this.wheelPrecision = 3;
        this.noPreventDefault = true;
    }

    wheelZoom(p) {
        if (p.type !== BABYLON.PointerEventTypes.POINTERWHEEL) return;
        var event = p.event;
        var delta = 0;

        if (event.wheelDelta) {
            delta = event.wheelDelta / (this.wheelPrecision * ZOOM_SENSITIVITY);
        } else if (event.detail) {
            delta = -event.detail / this.wheelPrecision;
        }

        if (delta) {
            let dirX = Math.sin(this.camera.rotation.y) * Math.cos(this.camera.rotation.x);
            let dirY = -Math.sin(this.camera.rotation.x);
            let dirZ = Math.cos(this.camera.rotation.y) * Math.cos(this.camera.rotation.x);
            let move = new BABYLON.Vector3(delta * dirX, delta * dirY, delta * dirZ);
            this.camera.cameraDirection.addInPlace(move);
        }

        if (event.preventDefault) {
            if (!this.noPreventDefault) {
                event.preventDefault();
            }
        }
    }

    getTypeName() {
        return 'DefaultCameraMouseZoomInput';
    }

    getSimpleName() {
        return 'mouseZoom';
    }

    attachControl(element, noPreventDefault) {
        this.noPreventDefault = noPreventDefault;
        this.observer = this.camera
            .getScene()
            .onPointerObservable.add(this.wheelZoom, BABYLON.PointerEventTypes.POINTERWHEEL);
    }

    detachControl(element) {
        if (this._observer && element) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
            this._wheel = null;
        }
    }
}

module.exports = {
    DefaultCameraKeyboardMoveInput,
    DefaultCameraMouseZoomInput,
};
