import * as alt from 'alt-client';
import * as native from 'natives';
import { ASC_CameraConfig } from './config.js';

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
            native.renderScriptCams(false, ASC_CameraConfig.ease, ASC_CameraConfig.easeTime, true, false, 0);
            native.destroyCam(mimicCamera, false);
            alt.clearEveryTick(mimicTick);

            mimicTick = null;
            mimicCamera = null;
        }
    },

    updateMimicCamera() {
        if (mimicCamera) {
            const gameplayCamPos = native.getGameplayCamCoord();
            const gameplayCamRot = native.getGameplayCamRot(2);

            native.setCamCoord(mimicCamera, gameplayCamPos.x, gameplayCamPos.y, gameplayCamPos.z - 1.25);
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
        native.renderScriptCams(true, ASC_CameraConfig.ease, ASC_CameraConfig.easeTime, true, false, 0);
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
