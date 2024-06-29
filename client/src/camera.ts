import * as alt from 'alt-client';
import * as native from 'natives';

import { cameraControl, mimicCamera } from './controlHandler.js';

const originalFov = native.getGameplayCamFov();
let currentFov = originalFov;

const cameraOffset = {
    x: 0,
    y: 0,
    z: 0,
};

const easeSettings = {
    ease: false,
    time: 1500,
};

export function focusOnPlayer() {
    native.pointCamAtEntity(mimicCamera, alt.Player.local, 0, 0, 0, true);
}

export function focusOnVehicle(vehicleReceived?: alt.Vehicle) {
    if (!vehicleReceived) {
        const vehicle = alt.Player.local.vehicle;
        if (!vehicle) return;

        native.pointCamAtEntity(mimicCamera, vehicle.scriptID, 0, 0, 0, true);
    } else {
        native.pointCamAtEntity(mimicCamera, vehicleReceived.scriptID, 0, 0, 0, true);
    }
}

export function setCameraOffset(x: number, y: number, z: number) {
    cameraOffset.x = x;
    cameraOffset.y = y;
    cameraOffset.z = z;

    return { ...cameraOffset };
}

export function getCameraOffset() {
    return { ...cameraOffset };
}

export function cameraEase(enabled: boolean, time: number) {
    easeSettings.ease = enabled;

    easeSettings.time = time;
}

export function getEase() {
    return { ...easeSettings };
}

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
