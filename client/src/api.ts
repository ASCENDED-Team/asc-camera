import * as alt from 'alt-client';
import * as native from 'natives';
import { useClientApi } from '@Client/api/index.js';
import {
    cameraEase,
    cameraZoomIn,
    cameraZoomOut,
    focusOnPlayer,
    focusOnVehicle,
    onCameraMoveEnd,
    onCameraMoveStart,
    setCameraOffset,
} from './camera.js';
import { movementControl } from './controlHandler.js';
import { LocalVehicle } from 'alt-client';

export function useCameraAPI() {
    function focusPlayer() {
        focusOnPlayer();
    }

    function focusVehicle(vehicleReiceved?: alt.Vehicle | LocalVehicle) {
        if (vehicleReiceved) {
            focusOnVehicle(vehicleReiceved);
        } else {
            focusOnVehicle();
        }
    }

    function ease(enabled: boolean, time: number) {
        cameraEase(enabled, time);
    }

    function setOffset(x = 0, y = 0, z = 0) {
        setCameraOffset(x, y, z);
    }

    function onMovementControl(state: boolean) {
        movementControl[state ? 'enable' : 'disable']();
    }

    function cameraMoveStart() {
        onCameraMoveStart();
    }

    function cameraMoveEnd() {
        onCameraMoveEnd();
    }

    function cameraMoveIn(value: number = 1) {
        cameraZoomIn(value);
    }

    function cameraMoveOut(value: number = 1) {
        cameraZoomOut(value);
    }

    return {
        focusPlayer,
        focusVehicle,
        setOffset,
        ease,
        cameraMoveStart,
        cameraMoveEnd,
        cameraMoveIn,
        cameraMoveOut,
        onMovementControl,
    };
}

declare global {
    export interface ClientPlugin {
        ['ascended-camera-api']: ReturnType<typeof useCameraAPI>;
    }
}

useClientApi().register('ascended-camera-api', useCameraAPI());
