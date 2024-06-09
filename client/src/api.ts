import { useClientApi } from '@Client/api/index.js';
import { cameraZoomIn, cameraZoomOut, onCameraMoveEnd, onCameraMoveStart } from './camera.js';
import { movementControl } from './controlHandler.js';

export function useCameraAPI() {
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
