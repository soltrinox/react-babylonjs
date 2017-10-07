const ZOOM_SENSITIVITY = 200;

module.exports = class DefaultCameraMouseZoomInput {
    constructor(BABYLON) {
        this.BABYLON = BABYLON;
        this.observer = null;
        this.wheelZoom = this.wheelZoom.bind(this);
        this.wheelPrecision = 3;
        this.noPreventDefault = true;
    }

    wheelZoom(p) {
        if (p.type !== this.BABYLON.PointerEventTypes.POINTERWHEEL) return;
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
            let move = new this.BABYLON.Vector3(delta * dirX, delta * dirY, delta * dirZ);
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
            .onPointerObservable.add(this.wheelZoom, this.BABYLON.PointerEventTypes.POINTERWHEEL);
    }

    detachControl(element) {
        if (this._observer && element) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
            this._wheel = null;
        }
    }
};
