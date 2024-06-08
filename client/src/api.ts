import { useClientApi } from '@Client/api/index.js';
import { cameraZoomIn, cameraZoomOut, onCameraMoveEnd, onCameraMoveStart } from './camera.js';
import { movementControl } from './controlhandler.js';

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

// Declare global to TypeScript recognizes the typings
declare global {
    export interface ClientPlugin {
        ['ascended-camera-api']: ReturnType<typeof useCameraAPI>;
    }
}

// Really important to execute the return of your function
useClientApi().register('ascended-camera-api', useCameraAPI());