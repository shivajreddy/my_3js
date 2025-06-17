import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './App.css';

function App() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const lightRef = useRef<THREE.DirectionalLight | null>(null);
    const pointLightRef = useRef<THREE.PointLight | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    const [geometryType, setGeometryType] = useState('box');
    const [materialType, setMaterialType] = useState('basic');
    const [color, setColor] = useState('#4CAF50');
    const [rotationSpeed, setRotationSpeed] = useState(0.01);
    const [lightIntensity, setLightIntensity] = useState(1);
    const [cameraDistance, setCameraDistance] = useState(5);
    const [info, setInfo] = useState('Box geometry with Basic material');

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = cameraDistance;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;
        canvasRef.current!.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        lightRef.current = directionalLight;

        const pointLight = new THREE.PointLight(0xff6666, 0.5);
        pointLight.position.set(-5, 3, 0);
        scene.add(pointLight);
        pointLightRef.current = pointLight;

        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        scene.add(gridHelper);

        const createMesh = () => {
            if (meshRef.current) {
                scene.remove(meshRef.current);

                // Dispose geometry
                meshRef.current.geometry.dispose();

                // Dispose material(s)
                const material = meshRef.current.material;
                if (Array.isArray(material)) {
                    material.forEach((m) => m.dispose());
                } else {
                    material.dispose();
                }
            }


            let geometry: THREE.BufferGeometry;
            switch (geometryType) {
                case 'sphere':
                    geometry = new THREE.SphereGeometry(1, 32, 32);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(2, 2, 2);
            }

            let material: THREE.Material;
            const colorHex = new THREE.Color(color);

            switch (materialType) {
                case 'standard':
                    material = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.5, roughness: 0.5 });
                    break;
                case 'phong':
                    material = new THREE.MeshPhongMaterial({ color: colorHex, shininess: 100, specular: 0x222222 });
                    break;
                default:
                    material = new THREE.MeshBasicMaterial({ color: colorHex });
            }

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            meshRef.current = mesh;

            setInfo(`${capitalize(geometryType)} geometry with ${capitalize(materialType)} material`);
        };

        const onWindowResize = () => {
            if (!rendererRef.current || !cameraRef.current) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);

        const animate = () => {
            requestAnimationFrame(animate);
            if (meshRef.current) {
                meshRef.current.rotation.x += rotationSpeed;
                meshRef.current.rotation.y += rotationSpeed;
            }

            const t = Date.now() * 0.001;
            if (pointLightRef.current) {
                pointLightRef.current.position.x = Math.sin(t) * 3;
                pointLightRef.current.position.z = Math.cos(t) * 3;
            }

            renderer.render(scene, camera);
        };

        createMesh();
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    useEffect(() => {
        if (lightRef.current) {
            lightRef.current.intensity = lightIntensity;
        }
    }, [lightIntensity]);

    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.position.z = cameraDistance;
        }
    }, [cameraDistance]);

    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
    }, [geometryType, materialType, color]);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.color.set(color);
        }
    }, [color]);

    return (
        <>
            <div id="canvas-container" ref={canvasRef}></div>

            <div id="controls">
                <h3>Three.js Playground</h3>

                <div className="control-group">
                    <label>Geometry:</label>
                    <button onClick={() => setGeometryType('box')}>Box</button>
                    <button onClick={() => setGeometryType('sphere')}>Sphere</button>
                    <button onClick={() => setGeometryType('torus')}>Torus</button>
                </div>

                <div className="control-group">
                    <label>Material:</label>
                    <button onClick={() => setMaterialType('basic')}>Basic</button>
                    <button onClick={() => setMaterialType('standard')}>Standard</button>
                    <button onClick={() => setMaterialType('phong')}>Phong</button>
                </div>

                <div className="control-group">
                    <label>Object Color:</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </div>

                <div className="control-group">
                    <label>Rotation Speed:</label>
                    <input type="range" min="0" max="0.1" step="0.001" value={rotationSpeed} onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} />
                </div>

                <div className="control-group">
                    <label>Light Intensity:</label>
                    <input type="range" min="0" max="2" step="0.1" value={lightIntensity} onChange={(e) => setLightIntensity(parseFloat(e.target.value))} />
                </div>

                <div className="control-group">
                    <label>Camera Distance:</label>
                    <input type="range" min="2" max="10" step="0.5" value={cameraDistance} onChange={(e) => setCameraDistance(parseFloat(e.target.value))} />
                </div>

                <div className="code-hint">
                    Tip: mesh.rotation.x += speed
                </div>
            </div>

            <div className="info">
                <strong>Mouse Controls:</strong> Left click + drag to rotate | Right click + drag to pan | Scroll to zoom<br />
                <strong>Current:</strong> {info}
            </div>
        </>
    );
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default App;

