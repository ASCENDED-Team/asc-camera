import { useClientApi } from '@Client/api/index.js';
import { cameraZoomIn, cameraZoomOut, onCameraMoveEnd, onCameraMoveStart } from './camera.js';
import { movementControl } from './controlHandler.js';

export function useCameraAPI() {
    function onMovementControl() {
        movementControl
    }
    function cameraMoveStart() {
        onCameraMoveStart();
    }
    function cameraMoveEnd() {
        onCameraMoveEnd();
    }
    function cameraMoveIn() {
        cameraZoomIn();
    }
    function cameraMoveOut() {
        cameraZoomOut();
    }

    return {
        cameraMoveStart,
        cameraMoveEnd,
        cameraMoveIn,
        cameraMoveOut,
        movementControl,
    };
}

declare global {
    export interface ClientPlugin {
        ['ascended-camera-api']: ReturnType<typeof useCameraAPI>;
    }
}

useClientApi().register('ascended-camera-api', useCameraAPI());