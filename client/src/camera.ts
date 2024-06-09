import * as alt from 'alt-client';
import * as native from 'natives';

import { cameraControl, mimicCamera } from './controlHandler.js';

const originalFov = native.getGameplayCamFov();
let currentFov = originalFov;

export function onCameraMoveStart() {
    cameraControl.enable();
}

export function onCameraMoveEnd() {
    cameraControl.disable();
}

export function cameraZoomIn(value: number = 1) {
    currentFov = currentFov - value;
    native.setCamFov(mimicCamera, currentFov);
}

export function cameraZoomOut(value: number = 1) {
    currentFov = currentFov + value;
    native.setCamFov(mimicCamera, currentFov);
}
