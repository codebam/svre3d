import { THREE } from "enable3d";
import { PlayerInfo } from "../repositories/player.js";
export class CameraManager {
    static setCamera(camera) {
        this.camera = camera;
    }
    static setCanvas(canvas) {
        this.canvas = canvas;
        canvas.addEventListener('wheel', (e) => {
            const zoomSpeed = 0.1; // Adjust zoom sensitivity
            // Calculate new distance and clamp it within bounds
            const newDistance = CameraManager.cameraDistance + e.deltaY * zoomSpeed;
            this.setCameraDistance(newDistance);
            this.updateCameraOffset();
        });
    }
    static adjustCameraDistance(deltaY) {
        const zoomSpeed = 0.1; // Adjust zoom sensitivity
        // Calculate new distance and clamp it within bounds
        const newDistance = CameraManager.cameraDistance + deltaY * zoomSpeed;
        CameraManager.cameraDistance = Math.max(10, Math.min(newDistance, 100));
        this.updateCameraOffset();
    }
    static setCameraDistance(distance) {
        CameraManager.cameraDistance = Math.max(5, Math.min(distance, 100));
    }
    static changeCameraAngle() {
        if (CameraManager.cameraPosition.lookat)
            return;
        CameraManager.cameraPosition.current++;
        if (CameraManager.cameraPosition.current >= CameraManager.cameraPosition.angles.length)
            CameraManager.cameraPosition.current = 0;
        CameraManager.cameraPosition.offset = CameraManager.cameraPosition.angles[CameraManager.cameraPosition.current];
    }
    static updateCameraOffset() {
        const angle = CameraManager.cameraPosition.angles[CameraManager.cameraPosition.current];
        CameraManager.cameraPosition.offset.set(angle.x > 0 ? CameraManager.cameraDistance : -CameraManager.cameraDistance, CameraManager.cameraDistance, angle.z > 0 ? CameraManager.cameraDistance : -CameraManager.cameraDistance);
    }
    static updateCameraLocation() {
        const playerPosition = PlayerInfo.entity.object3d.position;
        const playerRotation = PlayerInfo.entity.object3d.rotation;
        const offsetVector = CameraManager.cameraPosition.offset.clone();
        if (CameraManager.lockCameraToObject)
            offsetVector.applyEuler(playerRotation);
        const cameraPosition = new THREE.Vector3().copy(playerPosition).add(offsetVector);
        CameraManager.camera.position.copy(cameraPosition);
        if (CameraManager.cameraPosition.lookat)
            CameraManager.camera.lookAt(playerPosition.clone().add(CameraManager.cameraPosition.lookat).applyEuler(PlayerInfo.entity.object3d.rotation));
        else
            CameraManager.camera.lookAt(playerPosition);
    }
    static toggleLock() {
        this.lockCameraToObject = !this.lockCameraToObject;
    }
    static update() {
        CameraManager.updateCameraLocation();
    }
}
CameraManager.cameraDistance = 15;
CameraManager.cameraPosition = {
    offset: new THREE.Vector3(CameraManager.cameraDistance, CameraManager.cameraDistance, -CameraManager.cameraDistance),
    // offset: new THREE.Vector3(0, 3, -5),
    diagonal: 10,
    lookat: false,
    angles: [
        new THREE.Vector3(CameraManager.cameraDistance, CameraManager.cameraDistance, -CameraManager.cameraDistance),
        new THREE.Vector3(CameraManager.cameraDistance, CameraManager.cameraDistance, CameraManager.cameraDistance),
        new THREE.Vector3(-CameraManager.cameraDistance, CameraManager.cameraDistance, CameraManager.cameraDistance),
        new THREE.Vector3(-CameraManager.cameraDistance, CameraManager.cameraDistance, -CameraManager.cameraDistance),
        new THREE.Vector3(CameraManager.cameraDistance, CameraManager.cameraDistance, 0),
        new THREE.Vector3(-CameraManager.cameraDistance, CameraManager.cameraDistance, 0),
    ],
    current: 0
};
CameraManager.lockCameraToObject = true;
