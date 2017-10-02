
module.exports = class DefaultCameraKeyboardMoveInput {
    constructor(BABYLON) {
        this.BABYLON = BABYLON;
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
            this.BABYLON.Tools.RegisterTopRootEvents([{ name: 'blur', handler: this.onLostFocus }]);
        }
    }

    detachControl(element) {
        if (this.onKeyDown) {
            element.removeEventListener('keydown', this.onKeyDown);
            element.removeEventListener('keyup', this.onKeyUp);
            this.BABYLON.Tools.UnregisterTopRootEvents([{ name: 'blur', handler: this.onLostFocus }]);
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
                this.BABYLON.Vector3.TransformNormalToRef(
                    camera._localDirection,
                    camera._cameraTransformMatrix,
                    camera._transformedDirection
                );

                if (
                    this.keysPlus.indexOf(keyCode) === -1 &&
                    this.keysDash.indexOf(keyCode) === -1
                ) {
                    camera._localDirection.multiplyInPlace(new this.BABYLON.Vector3(1, 1, 0));
                    camera._transformedDirection.y = 0;
                }

                camera.cameraDirection.addInPlace(camera._transformedDirection);
            }
        }
    }

    onLostFocus() {
        this.keys = [];
    }
};
