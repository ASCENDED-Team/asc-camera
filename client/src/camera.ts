import * as alt from 'alt-client';
import * as native from 'natives';

import { cameraControl, mimicCamera } from "./controlhandler.js";

const originalFov = native.getGameplayCamFov();
let currentFov = originalFov;

export function onCameraMoveStart() {
    cameraControl.enable();
}

export function onCameraMoveEnd() {
    cameraControl.disable();
}

export function cameraZoomIn() {
    alt.log('Zooming in');
    currentFov = currentFov - 1;
    native.setCamFov(mimicCamera, currentFov);
}

export function cameraZoomOut() {
    currentFov = currentFov + 1;
    native.setCamFov(mimicCamera, currentFov);
}