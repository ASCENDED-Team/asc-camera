import { useClientApi } from '@Client/api/index.js';
import { cameraZoomIn, cameraZoomOut, focusOnPlayer, focusOnVehicle, onCameraMoveEnd, onCameraMoveStart, setCameraOffset } from './camera.js';
import { movementControl } from './controlHandler.js';

export function useCameraAPI() {
    function focusPlayer() {
        focusOnPlayer()
    }

    function focusVehicle() {
        focusOnVehicle()
    }

    function setOffset() {
        setCameraOffset();
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
        focusOnPlayer,
        focusOnVehicle,
        setCameraOffset,
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
