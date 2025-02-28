import React, { useEffect, useRef } from "react";
import { THREE } from "enable3d";
import { cloneGltf } from "../../lib/gltfclone";
import { Equipments } from "../../repositories/equipments";
import { Items } from "../../repositories/items";
let previewData = {
    object: null,
    item: null,
    scene: null,
    camera: null,
    renderer: null,
    prevAnimFrame: null,
};
function updateCurrentItem(item) {
    if (!item)
        return;
    previewData.item = item;
    if (previewData.object) {
        previewData.scene?.remove(previewData.object);
    }
    const object = item.reference.resource.loader === "gltf"
        ? cloneGltf(item.reference.resource.load)
        : item.reference.resource.load.clone();
    previewData.scene?.add(object);
    previewData.object = object;
    previewData.camera.lookAt(0, 0, 0);
    object.position.setScalar(0);
    object.rotation.y = Math.PI * 1.5;
    if (item.reference.view?.preview) {
        const p = item.reference.view?.preview;
        if (p.position) {
            object.position.x += p.position.x;
            object.position.y += p.position.y;
            object.position.z += p.position.z;
        }
        if (p.rotation) {
            object.rotation.y = typeof p.rotation == "string" && p.rotation.endsWith('rad') ? parseFloat(p.rotation) : THREE.MathUtils.degToRad(parseFloat(p.rotation));
        }
        if (p.scale) {
            object.scale.setScalar(p.scale);
        }
    }
    if (item.reference.view?.material) {
        Equipments.applyMaterial(object, item, { data: {} });
    }
    if (item.reference.view?.animation) {
        Items.initItemAnimation(item, object);
    }
}
function previewItem(canvas) {
    if (!previewData.renderer) {
        previewData.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        previewData.renderer.setPixelRatio(window.devicePixelRatio);
        previewData.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    else {
        previewData.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        previewData.renderer.setPixelRatio(window.devicePixelRatio);
    }
    if (!previewData.scene)
        previewData.scene = new THREE.Scene();
    if (previewData.prevAnimFrame)
        cancelAnimationFrame(previewData.prevAnimFrame);
    const scene = previewData.scene;
    if (previewData.object) {
        previewData.scene?.remove(previewData.object);
    }
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 4;
    const camera = new THREE.OrthographicCamera((frustumSize * aspect) / -2, (frustumSize * aspect) / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
    const isometricAngle = Math.PI / 4; // 45 degrees
    camera.position.set(Math.cos(isometricAngle) * frustumSize, frustumSize / 1.5, Math.sin(isometricAngle) * frustumSize);
    previewData.camera = camera;
    scene.add(new THREE.AmbientLight(0xb1b1b1, 1));
    const dlight = new THREE.DirectionalLight(0xffffff, 1);
    dlight.position.set(0, 30, 40);
    scene.add(dlight);
    camera.lookAt(0, 0, 0);
    if (!previewData.object) {
        scene.add((previewData.object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }))));
    }
    function onWindowResize() {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
        previewData.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    canvas.addEventListener('resize', onWindowResize);
    let rotationEnabled = false;
    canvas.addEventListener('click', () => rotationEnabled = !rotationEnabled);
    function render() {
        if (previewData.object && rotationEnabled) {
            previewData.object.rotation.y += 0.01;
        }
        previewData.renderer.render(scene, camera);
        previewData.prevAnimFrame = requestAnimationFrame(render);
    }
    render();
}
export function ItemPreview({ currentItem }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            previewItem(canvas);
            updateCurrentItem(currentItem);
        }
        // Cleanup on component unmount
        return () => {
            if (previewData.prevAnimFrame) {
                cancelAnimationFrame(previewData.prevAnimFrame);
            }
            if (previewData.renderer) {
                previewData.renderer.dispose();
                previewData.renderer = null;
            }
            previewData.scene = null;
            previewData.camera = null;
            previewData.object = null;
        };
    }, [currentItem]);
    return React.createElement("canvas", { className: "item-3d-preview", ref: canvasRef });
}
