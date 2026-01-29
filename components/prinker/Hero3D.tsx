"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function AnimatedSphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;

            // Mouse interaction effect
            const { x, y } = state.mouse;
            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * 1, 0.1);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * 1, 0.1);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={hovered ? 1.2 : 1} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <MeshDistortMaterial
                    color="#4f46e5" // Indigo-ish
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={0.8}
                    envMapIntensity={1}
                />
            </Sphere>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <AnimatedSphere />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>

            {/* Overlay Content */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <h1 className="text-6xl font-bold text-white tracking-tighter mb-4 drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                    PRINKER_
                </h1>
                <p className="text-xl text-zinc-400 max-w-lg text-center font-light uppercase tracking-widest">
                    High-End Real Estate Intelligence
                </p>
            </div>
        </div>
    );
}
