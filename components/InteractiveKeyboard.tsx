"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function KeyboardModel({ zoom }: { zoom: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly interpolate scale based on zoom state
      const targetScale = 1 + zoom * 0.5;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Simple stylized keyboard representation
  return (
    <group ref={groupRef} dispose={null}>
      {/* Base Case */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.4, 2.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Keys */}
      <group position={[-2.8, 0.1, -1.1]}>
        {Array.from({ length: 5 }).map((_, row) => (
          <group key={row} position={[0, 0, row * 0.55]}>
            {Array.from({ length: 14 }).map((_, col) => {
              // Skip some keys to make it look like a 65% layout
              if (row === 4 && (col === 3 || col === 4 || col === 5 || col === 6 || col === 7)) {
                if (col === 5) {
                  // Spacebar
                  return (
                    <mesh key={col} position={[col * 0.4 + 0.8, 0, 0]} castShadow receiveShadow>
                      <boxGeometry args={[2.5, 0.2, 0.45]} />
                      <meshStandardMaterial color="#0A0A0C" roughness={0.4} metalness={0.8} />
                    </mesh>
                  );
                }
                return null;
              }
              
              // Accent keys
              const isAccent = (row === 0 && col === 0) || (row === 2 && col === 13);
              const color = isAccent ? "#FF6A00" : "#0A0A0C";

              return (
                <mesh key={col} position={[col * 0.42, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.38, 0.2, 0.45]} />
                  <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* Knob (65% feature) */}
      <mesh position={[2.6, 0.2, -0.9]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
        <meshStandardMaterial color="#FF6A00" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

export function InteractiveKeyboard() {
  const [zoom, setZoom] = useState(0);

  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas shadows camera={{ position: [0, 4, 6], fov: 45 }}>
          <color attach="background" args={["transparent"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Float rotationIntensity={0.4} floatIntensity={2} speed={1.5}>
              <KeyboardModel zoom={zoom} />
            </Float>
          </PresentationControls>

          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      {/* Interaction Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-auto">
        <div className="text-white/40 text-sm tracking-widest uppercase flex items-center gap-2 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Drag to rotate
        </div>
        
        <div className="flex items-center gap-4 bg-[#0A0A0C]/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          <button 
            onClick={() => setZoom(Math.max(0, zoom - 0.5))}
            className="text-white/60 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-[#FF6A00] transition-all duration-300"
              style={{ width: `${(zoom / 2) * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          <button 
            onClick={() => setZoom(Math.min(2, zoom + 0.5))}
            className="text-white/60 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
