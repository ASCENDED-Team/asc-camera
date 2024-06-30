import * as alt from 'alt-client';
import * as native from 'natives';
import { focusOnPlayer, focusOnVehicle, getCameraOffset, getEase } from './camera.js';

export let mimicCamera: number = undefined;

let CamInterval: number = undefined;
let MoveInterval: number = undefined;
let mimicTick: number = undefined;

const CAMERA_CONTROLS = [0, 1, 2, 3, 4, 5, 6, 7, 18, 24, 53, 54, 69];

export const movementControl = {
    enable() {
        moveControl.enable();
        cameraControl.enable();
        mimicControl.disable();
    },

    disable() {
        moveControl.disable();
        cameraControl.disable();
        mimicControl.enable();
    },
};

const mimicControl = {
    enable() {
        this.createMimicCamera();
        mimicTick = alt.everyTick(this.updateMimicCamera);
    },

    disable() {
        if (mimicCamera) {
            native.setCamActive(mimicCamera, false);
            native.renderScriptCams(false, getEase().ease, getEase().time, true, false, 0);
            native.destroyCam(mimicCamera, false);
            alt.clearEveryTick(mimicTick);

            mimicTick = null;
            mimicCamera = null;
        }
    },

    updateMimicCamera() {
        if (mimicCamera) {
            const offset = getCameraOffset();
            const gameplayCamPos = native.getGameplayCamCoord();
            const gameplayCamRot = native.getGameplayCamRot(2);

            const { forward, right, up } = getDirectionVectors(gameplayCamRot);

            const worldOffset = {
                x: offset.x * right.x + offset.y * forward.x + offset.z * up.x,
                y: offset.x * right.y + offset.y * forward.y + offset.z * up.y,
                z: offset.x * right.z + offset.y * forward.z + offset.z * up.z,
            };

            native.setCamCoord(
                mimicCamera,
                gameplayCamPos.x + worldOffset.x,
                gameplayCamPos.y + worldOffset.y,
                gameplayCamPos.z + worldOffset.z,
            );

            native.setCamRot(mimicCamera, gameplayCamRot.x, gameplayCamRot.y, gameplayCamRot.z, 2);
        }
    },

    createMimicCamera() {
        const gameplayCamPos = native.getGameplayCamCoord();
        const gameplayCamRot = native.getGameplayCamRot(2);

        mimicCamera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            gameplayCamPos.x,
            gameplayCamPos.y,
            gameplayCamPos.z,
            gameplayCamRot.x,
            gameplayCamRot.y,
            gameplayCamRot.z,
            native.getGameplayCamFov(),
            false,
            0,
        );

        native.setCamActive(mimicCamera, true);
        native.renderScriptCams(true, getEase().ease, getEase().time, true, false, 0);
    },
};

const moveControl = {
    tick() {
        native.disableAimCamThisUpdate();

        for (let controlIndex = 0; controlIndex <= 359; controlIndex++) {
            if (!CAMERA_CONTROLS.includes(controlIndex)) {
                // Disable controls that are not camera related
                native.disableControlAction(0, controlIndex, true);
                native.disableControlAction(1, controlIndex, true);
                native.disableControlAction(2, controlIndex, true);
            }
        }
    },

    disable() {
        if (typeof MoveInterval !== 'undefined') {
            return;
        }

        MoveInterval = alt.setInterval(moveControl.tick, 0);
    },

    enable() {
        if (typeof MoveInterval === 'undefined') {
            return;
        }

        alt.clearInterval(MoveInterval);
        MoveInterval = undefined;
    },
};

export const cameraControl = {
    tick() {
        native.disableAimCamThisUpdate();

        for (let control of CAMERA_CONTROLS) {
            native.disableControlAction(0, control, true);
        }
    },

    disable() {
        if (typeof CamInterval !== 'undefined') {
            return;
        }

        CamInterval = alt.setInterval(cameraControl.tick, 0);
    },

    enable() {
        if (typeof CamInterval === 'undefined') {
            return;
        }

        alt.clearInterval(CamInterval);
        CamInterval = undefined;
    },
};

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function getDirectionVectors(rotation) {
    const pitch = degreesToRadians(rotation.x);
    const yaw = degreesToRadians(rotation.z);
    const roll = degreesToRadians(rotation.y);

    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosRoll = Math.cos(roll);
    const sinRoll = Math.sin(roll);

    const forward = {
        x: cosPitch * cosYaw,
        y: cosPitch * sinYaw,
        z: sinPitch,
    };

    const right = {
        x: cosYaw * sinRoll * sinPitch - cosRoll * sinYaw,
        y: cosYaw * cosRoll + sinYaw * sinRoll * sinPitch,
        z: -cosPitch * sinRoll,
    };

    const up = {
        x: cosYaw * sinPitch * sinRoll + cosRoll * sinYaw,
        y: sinYaw * sinPitch * sinRoll - cosRoll * cosYaw,
        z: cosPitch * cosRoll,
    };

    return { forward, right, up };
}
