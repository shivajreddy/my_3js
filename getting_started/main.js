import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild(renderer.domElement);
document.getElementById("canvas").appendChild(renderer.domElement);

function getBoxColor() {
    return Math.floor(Math.random() * 0x1000000);
}
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: getBoxColor() });
const cube = new THREE.Mesh(boxGeometry, material);
cube.rotateY(20);

scene.add(cube);

const color = 0x006699;
const matDark = new THREE.LineBasicMaterial({
    color: color,
    side: THREE.DoubleSide
});
const matLight = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: .4,
    side: THREE.DoubleSide
});
const message = ' three.js';

camera.position.z = 5;
renderer.setAnimationLoop(() => {
    // cube.rotation.x += 0.01;
    // cube.rotation.y -= 0.01;
    renderer.render(scene, camera)
});

var count = 0;
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("update");
    button.addEventListener("click", function () {
        count++;
        console.clear();
        console.log("Count:", count);
        cube.material.color.setHex(getBoxColor());
    })
})


