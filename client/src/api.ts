import * as alt from 'alt-client';

import { useClientApi } from '@Client/api/index.js';
import {
    cameraEase,
    cameraZoomIn,
    cameraZoomOut,
    focusOnPlayer,
    focusOnVehicle,
    getEase,
    onCameraMoveEnd,
    onCameraMoveStart,
    setCameraOffset,
} from './camera.js';
import { movementControl } from './controlHandler.js';

export function useCameraAPI() {
    function focusPlayer() {
        focusOnPlayer();
    }

    function focusVehicle(vehicleReiceved?: alt.Vehicle) {
        if (vehicleReiceved) {
            focusOnVehicle(vehicleReiceved);
        } else {
            focusOnVehicle();
        }
    }

    function ease(enabled: boolean, time: number) {
        cameraEase(enabled, time);
    }

    function setOffset() {
        setCameraOffset(0, 0, 0);
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
