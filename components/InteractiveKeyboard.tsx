"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, PresentationControls, Text } from "@react-three/drei";
import * as THREE from "three";

// Colors matching the provided image
const COLOR_BASE = "#c85a17"; // Copper/Orange
const COLOR_MOD = "#4a1c05";  // Dark Brown
const COLOR_ALPHA = "#e5e5e5"; // White
const COLOR_TEXT_MOD = "#e5e5e5";
const COLOR_TEXT_ALPHA = "#4a1c05";

// Materials
const materialBase = new THREE.MeshStandardMaterial({ color: COLOR_BASE, roughness: 0.2, metalness: 0.8 });
const materialMod = new THREE.MeshStandardMaterial({ color: COLOR_MOD, roughness: 0.8, metalness: 0.1 });
const materialAlpha = new THREE.MeshStandardMaterial({ color: COLOR_ALPHA, roughness: 0.4, metalness: 0.1 });
const materialKnob = new THREE.MeshStandardMaterial({ color: COLOR_BASE, roughness: 0.2, metalness: 0.9 });

// Global state for pressed keys
const pressedKeys = new Set<string>();

// Procedural Thock Sound Generator (Web Audio API)
function playThock() {
  if (typeof window === 'undefined') return;
  try {
    if (!(window as any).audioCtx) {
      (window as any).audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = (window as any).audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    
    const t = ctx.currentTime;
    
    // Low thud (body of the switch)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.8, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);

    // High click (plastic bottom out)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(300, t);
    clickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.03);
    
    clickGain.gain.setValueAtTime(0, t);
    clickGain.gain.linearRampToValueAtTime(0.2, t + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    
    clickOsc.start(t);
    clickOsc.stop(t + 0.05);
  } catch (e) {
    // Ignore audio errors if context fails
  }
}

// Layout Definition (75% Keyboard) with Event Codes
type KeyDef = { l: string; w: number; m?: boolean; k?: boolean; c?: string };
const layout: KeyDef[][] = [
  [{l:'Esc', w:1, m:true, c:'Escape'}, {l:'F1', w:1, m:true, c:'F1'}, {l:'F2', w:1, m:true, c:'F2'}, {l:'F3', w:1, m:true, c:'F3'}, {l:'F4', w:1, m:true, c:'F4'}, {l:'F5', w:1, m:true, c:'F5'}, {l:'F6', w:1, m:true, c:'F6'}, {l:'F7', w:1, m:true, c:'F7'}, {l:'F8', w:1, m:true, c:'F8'}, {l:'F9', w:1, m:true, c:'F9'}, {l:'F10', w:1, m:true, c:'F10'}, {l:'F11', w:1, m:true, c:'F11'}, {l:'F12', w:1, m:true, c:'F12'}, {l:'Del', w:1, m:true, c:'Delete'}, {l:'', w:1, m:true, k:true}],
  [{l:'~', w:1, m:true, c:'Backquote'}, {l:'1', w:1, c:'Digit1'}, {l:'2', w:1, c:'Digit2'}, {l:'3', w:1, c:'Digit3'}, {l:'4', w:1, c:'Digit4'}, {l:'5', w:1, c:'Digit5'}, {l:'6', w:1, c:'Digit6'}, {l:'7', w:1, c:'Digit7'}, {l:'8', w:1, c:'Digit8'}, {l:'9', w:1, c:'Digit9'}, {l:'0', w:1, c:'Digit0'}, {l:'-', w:1, c:'Minus'}, {l:'+', w:1, c:'Equal'}, {l:'Backspace', w:2, m:true, c:'Backspace'}],
  [{l:'Tab', w:1.5, m:true, c:'Tab'}, {l:'Q', w:1, c:'KeyQ'}, {l:'W', w:1, c:'KeyW'}, {l:'E', w:1, c:'KeyE'}, {l:'R', w:1, c:'KeyR'}, {l:'T', w:1, c:'KeyT'}, {l:'Y', w:1, c:'KeyY'}, {l:'U', w:1, c:'KeyU'}, {l:'I', w:1, c:'KeyI'}, {l:'O', w:1, c:'KeyO'}, {l:'P', w:1, c:'KeyP'}, {l:'[', w:1, c:'BracketLeft'}, {l:']', w:1, c:'BracketRight'}, {l:'\\', w:1.5, m:true, c:'Backslash'}],
  [{l:'Caps', w:1.75, m:true, c:'CapsLock'}, {l:'A', w:1, c:'KeyA'}, {l:'S', w:1, c:'KeyS'}, {l:'D', w:1, c:'KeyD'}, {l:'F', w:1, c:'KeyF'}, {l:'G', w:1, c:'KeyG'}, {l:'H', w:1, c:'KeyH'}, {l:'J', w:1, c:'KeyJ'}, {l:'K', w:1, c:'KeyK'}, {l:'L', w:1, c:'KeyL'}, {l:';', w:1, c:'Semicolon'}, {l:'"', w:1, c:'Quote'}, {l:'Enter', w:2.25, m:true, c:'Enter'}],
  [{l:'Shift', w:2.25, m:true, c:'ShiftLeft'}, {l:'Z', w:1, c:'KeyZ'}, {l:'X', w:1, c:'KeyX'}, {l:'C', w:1, c:'KeyC'}, {l:'V', w:1, c:'KeyV'}, {l:'B', w:1, c:'KeyB'}, {l:'N', w:1, c:'KeyN'}, {l:'M', w:1, c:'KeyM'}, {l:'<', w:1, c:'Comma'}, {l:'>', w:1, c:'Period'}, {l:'?', w:1, c:'Slash'}, {l:'Shift', w:1.75, m:true, c:'ShiftRight'}, {l:'↑', w:1, m:true, c:'ArrowUp'}],
  [{l:'Ctrl', w:1.25, m:true, c:'ControlLeft'}, {l:'Win', w:1.25, m:true, c:'MetaLeft'}, {l:'Alt', w:1.25, m:true, c:'AltLeft'}, {l:'', w:6.25, m:false, c:'Space'}, {l:'Alt', w:1, m:true, c:'AltRight'}, {l:'Fn', w:1, m:true}, {l:'←', w:1, m:true, c:'ArrowLeft'}, {l:'↓', w:1, m:true, c:'ArrowDown'}, {l:'→', w:1, m:true, c:'ArrowRight'}]
];

const U = 0.42;
const gap = 0.04;

function Key3D({ keyDef, xPos, zPos }: { keyDef: KeyDef, xPos: number, zPos: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const keyWidth = keyDef.w * U - gap;
  const keyDepth = U - gap;

  useFrame(() => {
    if (groupRef.current) {
      const isPressed = keyDef.c && pressedKeys.has(keyDef.c);
      const targetY = isPressed ? 0.02 : 0.1; // Pressed down vs normal height
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.4);
    }
  });

  return (
    <group ref={groupRef} position={[xPos, 0.1, zPos]}>
      <mesh material={keyDef.m ? materialMod : materialAlpha} castShadow receiveShadow>
        <boxGeometry args={[keyWidth, 0.2, keyDepth]} />
      </mesh>
      {keyDef.l && (
        <Text
          position={[-(keyWidth/2) + 0.04, 0.101, -(keyDepth/2) + 0.04]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.06}
          color={keyDef.m ? COLOR_TEXT_MOD : COLOR_TEXT_ALPHA}
          anchorX="left"
          anchorY="top"
        >
          {keyDef.l}
        </Text>
      )}
    </group>
  );
}

function KeyboardModel({ zoom }: { zoom: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = 1 + zoom * 0.5;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const startX = -(15 * U) / 2 + U / 2;
  const startZ = -(6 * U) / 2 + U / 2;

  const keys = useMemo(() => {
    const result: React.ReactNode[] = [];
    let currentZ = startZ;

    layout.forEach((row, rowIndex) => {
      let currentX = startX;
      if (rowIndex === 1) currentZ += gap * 2; // Gap between F-row and numbers

      row.forEach((key, colIndex) => {
        const xPos = currentX + (key.w * U) / 2 - U / 2;

        if (key.k) {
          result.push(
            <mesh key={`${rowIndex}-${colIndex}`} material={materialKnob} position={[xPos, 0.25, currentZ]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.3, 32]} />
            </mesh>
          );
        } else {
          result.push(
            <Key3D key={`${rowIndex}-${colIndex}`} keyDef={key} xPos={xPos} zPos={currentZ} />
          );
        }
        currentX += key.w * U;
      });
      currentZ += U;
    });
    return result;
  }, [startX, startZ]);

  return (
    <group ref={groupRef} dispose={null} rotation={[0.15, 0, 0]}>
      <mesh material={materialBase} position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[15 * U + 0.2, 0.4, 6 * U + 0.3]} />
      </mesh>
      {keys}
    </group>
  );
}

export function InteractiveKeyboard() {
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pressedKeys.has(e.code)) {
        pressedKeys.add(e.code);
        playThock();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.code);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas 
          shadows 
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 7], fov: 45 }}
          style={{ touchAction: 'pan-y' }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["transparent"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow shadow-mapSize={[512, 512]} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <spotLight position={[0, 5, -5]} angle={0.5} penumbra={1} intensity={2} color="#ff4400" />
          
          <PresentationControls
            global
            snap={true}
            rotation={[0, -0.5, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Float rotationIntensity={0.2} floatIntensity={1.5} speed={1.5}>
              <KeyboardModel zoom={zoom} />
            </Float>
          </PresentationControls>

          <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={25} blur={2} far={4.5} resolution={256} color="#000000" />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-auto">
        <div className="text-white/40 text-sm tracking-widest uppercase flex items-center gap-2 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Type on your keyboard to test
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
              className="absolute top-0 left-0 h-full bg-[#c85a17] transition-all duration-300"
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
