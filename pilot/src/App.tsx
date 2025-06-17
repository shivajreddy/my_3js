import React, { useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Stats } from '@react-three/drei'
import * as THREE from 'three'

// Types
type GeometryType = 'box' | 'sphere' | 'torus'
type MaterialType = 'basic' | 'standard' | 'phong'

interface AnimatedMeshProps {
    geometry: GeometryType
    material: MaterialType
    color: string
    rotationSpeed: number
}

// Animated Mesh Component
const AnimatedMesh: React.FC<AnimatedMeshProps> = ({
    geometry,
    material,
    color,
    rotationSpeed }) => {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += rotationSpeed
            meshRef.current.rotation.y += rotationSpeed
        }
    })

    // Geometry selection
    const getGeometry = () => {
        switch (geometry) {
            case 'sphere':
                return <sphereGeometry args={[1, 32, 32]} />
            case 'torus':
                return <torusGeometry args={[1, 0.4, 16, 100]} />
            default:
                return <boxGeometry args={[2, 2, 2]} />
        }
    }

    // Material selection
    const getMaterial = () => {
        const props = { color }
        switch (material) {
            case 'standard':
                return <meshStandardMaterial {...props} metalness={0.5} roughness={0.5} />
            case 'phong':
                return <meshPhongMaterial {...props} shininess={100} specular="#222222" />
            default:
                return <meshBasicMaterial {...props} />
        }
    }

    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            {getGeometry()}
            {getMaterial()}
        </mesh>
    )
}

// Animated Light Component
const AnimatedPointLight: React.FC = () => {
    const lightRef = useRef<THREE.PointLight>(null)
    useFrame((state) => {
        if (lightRef.current) {
            const time = state.clock.getElapsedTime()
            lightRef.current.position.x = Math.sin(time) * 3

            lightRef.current.position.z = Math.cos(time) * 3
        }
    })
    return <pointLight ref={lightRef} color="#ff6666" intensity={0.5} position={[-5, 3, 0]} />
}

// Main App Component
export default function App() {
    // State
    const [geometry, setGeometry] = useState<GeometryType>('box')
    const [material, setMaterial] = useState<MaterialType>('basic')
    const [color, setColor] = useState('#4CAF50')

    const [rotationSpeed, setRotationSpeed] = useState(0.01)
    const [lightIntensity, setLightIntensity] = useState(1)
    const [cameraDistance] = useState(5)

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Three.js Canvas */}
            <Canvas
                shadows
                camera={{ position: [0, 0, cameraDistance], fov: 75 }}
                style={{ background: '#1a1a1a' }}
            >

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={lightIntensity}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <AnimatedPointLight />

                {/* Main Mesh */}
                <AnimatedMesh
                    geometry={geometry}
                    material={material}
                    color={color}
                    rotationSpeed={rotationSpeed}

                />

                {/* Helpers */}
                <Grid
                    args={[10, 10]}
                    cellSize={1}
                    cellThickness={1}
                    cellColor="#444444"
                    sectionColor="#222222"
                    fadeDistance={30}
                    fadeStrength={1}
                    followCamera={false}
                />

                {/* Controls */}
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={2}
                    maxDistance={10}
                />

                {/* Performance Monitor */}
                <Stats />
            </Canvas>


            {/* UI Controls */}
            <div style={styles.controls}>
                <h3 style={styles.title}>React Three Fiber Playground</h3>


                <div style={styles.controlGroup}>
                    <label style={styles.label}>Geometry:</label>
                    <div>
                        <button style={styles.button} onClick={() => setGeometry('box')}>Box</button>
                        <button style={styles.button} onClick={() => setGeometry('sphere')}>Sphere</button>
                        <button style={styles.button} onClick={() => setGeometry('torus')}>Torus</button>
                    </div>
                </div>


                <div style={styles.controlGroup}>
                    <label style={styles.label}>Material:</label>
                    <div>
                        <button style={styles.button} onClick={() => setMaterial('basic')}>Basic</button>
                        <button style={styles.button} onClick={() => setMaterial('standard')}>Standard</button>
                        <button style={styles.button} onClick={() => setMaterial('phong')}>Phong</button>
                    </div>
                </div>


                <div style={styles.controlGroup}>
                    <label style={styles.label}>Object Color:</label>

                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={styles.colorInput}
                    />
                </div>

                <div style={styles.controlGroup}>
                    <label style={styles.label}>Rotation Speed:</label>
                    <input
                        type="range"
                        min="0"
                        max="0.1"
                        step="0.001"
                        value={rotationSpeed}
                        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                        style={styles.rangeInput}
                    />
                    <span style={styles.value}>{rotationSpeed.toFixed(3)}</span>

                </div>

                <div style={styles.controlGroup}>
                    <label style={styles.label}>Light Intensity:</label>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={lightIntensity}
                        onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                        style={styles.rangeInput}
                    />
                    <span style={styles.value}>{lightIntensity.toFixed(1)}</span>
                </div>


                <div style={styles.codeHint}>
                    <code>useFrame((state, delta) ={'>'} rotation += delta)</code>
                </div>

            </div>

            {/* Info Panel */}
            <div style={styles.info}>
                <strong>Mouse Controls:</strong> Left drag to rotate | Right drag to pan | Scroll to zoom<br />
                <strong>Current:</strong> {geometry.charAt(0).toUpperCase() + geometry.slice(1)} geometry

                with {material.charAt(0).toUpperCase() + material.slice(1)} material
            </div>
        </div>
    )
}


// Styles
const styles: Record<string, React.CSSProperties> = {

    controls: {
        position: 'absolute',
        top: 10,
        left: 10,

        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: 15,
        borderRadius: 5,
        maxWidth: 320,
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        marginTop: 0,
        color: '#4CAF50',
        fontSize: 18
    },
    controlGroup: {
        margin: '12px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 10
    },
    label: {
        display: 'inline-block',
        width: 100,
        fontSize: 13,
        fontWeight: 'bold'
    },
    button: {
        background: '#4CAF50',

        color: 'white',
        border: 'none',
        padding: '6px 12px',
        margin: '0 2px',
        cursor: 'pointer',
        borderRadius: 3,
        fontSize: 12,
        transition: 'background 0.2s'
    },

    colorInput: {
        width: 50,
        height: 30,
        border: 'none',
        borderRadius: 3,
        cursor: 'pointer'
    },
    rangeInput: {

        width: 120,
        cursor: 'pointer'
    },
    value: {
        fontSize: 11,
        color: '#aaa',

        minWidth: 40,
        display: 'inline-block'
    },
    codeHint: {

        background: 'rgba(40, 40, 40, 0.9)',
        color: '#4CAF50',
        padding: 8,
        margin: '10px 0',
        fontFamily: 'monospace',

        fontSize: 11,
        borderRadius: 3,
        overflowX: 'auto'
    },
    info: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        fontSize: 12,
        fontFamily: 'Arial, sans-serif'
    }
}
