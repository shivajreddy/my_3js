import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(boxGeometry, material);

scene.add(cube);

var ptag = document.createElement('p');
ptag.textContent = "hello there";
var x = new CSS2DRenderer();
x.domElement = ptag;
x.render(scene, camera);

camera.position.z = 5;
renderer.setAnimationLoop(() => {
    cube.rotation.x += 0.01;
    // cube.rotation.y -= 0.01;
    renderer.render(scene, camera)
});

