import * as THREE from 'three';

const canvasContainer = document.getElementById("canvas");
const CANVAS_WIDTH = canvasContainer.clientWidth;
const CANVAS_HEIGHT = canvasContainer.clientHeight;

const scene = new THREE.Scene();
// fov, aspect-ratio, clip-near, clip-far
const camera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

canvasContainer.appendChild(renderer.domElement);

// Color function
function getBoxColor() {
    return Math.floor(Math.random() * 0x1000000);
}

// Cube
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: getBoxColor() });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);

// Torus
const torusGeometry = new THREE.TorusGeometry(1.5, .2, 12, 48);
// const torusGeometry = new THREE.TorusGeometry(14, 3, 8, 100);
// torusGeometry.parameters.radialSegments = 400;
// torusGeometry.parameters.tubularSegments = 400;
// const torusMaterial = new THREE.MeshBasicMaterial({ color: getBoxColor() });
const torusMaterial = new THREE.MeshStandardMaterial({ color: getBoxColor() });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
const torusLight = new THREE.PointLight(0xffffff, 1);
torusLight.position.set(5, 5, 5);
scene.add(torusLight);
const torusAmbientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(torusAmbientLight);
scene.add(torus);

cube.rotation.y += 10;
// scene.add(cube);

// Camera position
camera.position.z = 5;

var isPaused = false;

// Animation loop
renderer.setAnimationLoop(() => {
    if (!isPaused) {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
});

// Change Box color on button click
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("update");
    button.addEventListener("click", function () {
        // cube.material.color.setHex(getBoxColor());
        isPaused = !isPaused;
    });
});

