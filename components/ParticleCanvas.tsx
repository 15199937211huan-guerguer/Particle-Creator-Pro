
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleConfig, HandData, SceneEffect, GestureType, ModelType, OfficeLocation } from '../types';
import { generateParticles, generateTextParticles } from '../constants';

// Extend JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

// --- Office Data ---
const BYTEDANCE_OFFICES: OfficeLocation[] = [
  { id: 'bj', name: 'Beijing', desc: 'ByteDance HQ', lat: 39.9042, lng: 116.4074 },
  { id: 'sg', name: 'Singapore', desc: 'APAC HQ', lat: 1.3521, lng: 103.8198 },
  { id: 'la', name: 'Los Angeles', desc: 'Creative Hub', lat: 34.0522, lng: -118.2437 },
  { id: 'ny', name: 'New York', desc: 'Global Business', lat: 40.7128, lng: -74.0060 },
  { id: 'ld', name: 'London', desc: 'European Hub', lat: 51.5074, lng: -0.1278 },
  { id: 'sj', name: 'San Jose', desc: 'Tech Center', lat: 37.3382, lng: -121.8863 },
  { id: 'tk', name: 'Tokyo', desc: 'Innovation', lat: 35.6762, lng: 139.6503 },
  { id: 'sz', name: 'Shenzhen', desc: 'R&D Center', lat: 22.5431, lng: 114.0579 },
  { id: 'pa', name: 'Paris', desc: 'AI Research', lat: 48.8566, lng: 2.3522 },
  { id: 'db', name: 'Dubai', desc: 'MENA Hub', lat: 25.2048, lng: 55.2708 },
];

const latLongToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius) * Math.sin(phi) * Math.cos(theta);
  const z = (radius) * Math.sin(phi) * Math.sin(theta);
  const y = (radius) * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- Real 3D Earth Component ---
const Earth3D: React.FC<{ handData: React.MutableRefObject<HandData> }> = ({ handData }) => {
  const earthRef = useRef<THREE.Group>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  // Load Textures
  const earthTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  const specTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
  const cloudsTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  useFrame((state, delta) => {
    if (earthRef.current) {
       // Slow natural rotation
       earthRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={earthRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Earth Sphere */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshPhysicalMaterial 
           map={earthTexture} 
           specularMap={specTexture}
           roughness={0.6}
           metalness={0.1}
           color="#ffffff"
        />
      </mesh>

      {/* Atmosphere / Clouds */}
      <mesh>
         <sphereGeometry args={[3.25, 64, 64]} />
         <meshStandardMaterial 
            map={cloudsTexture} 
            transparent 
            opacity={0.3} 
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
         />
      </mesh>

      {/* Glow Halo */}
      <mesh scale={[1.1, 1.1, 1.1]}>
         <sphereGeometry args={[3.2, 32, 32]} />
         <meshBasicMaterial color="#0066ff" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Markers */}
      {BYTEDANCE_OFFICES.map((office) => {
        const pos = latLongToVector3(office.lat, office.lng, 3.26);
        const isSelected = selectedOffice === office.id;
        
        return (
          <group key={office.id} position={pos}
            onClick={(e) => {
               e.stopPropagation(); // Prevent orbit controls from getting weird
               setSelectedOffice(isSelected ? null : office.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
             <mesh>
               <sphereGeometry args={[0.08, 16, 16]} />
               <meshBasicMaterial color={isSelected ? "#ff3b30" : "#00ffcc"} />
             </mesh>
             {/* Pulse Ring */}
             <mesh rotation={[Math.PI/2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color={isSelected ? "#ff3b30" : "#00ffcc"} transparent opacity={0.5} side={THREE.DoubleSide} />
             </mesh>

             {/* Popup */}
             {isSelected && (
               <Html distanceFactor={10} zIndexRange={[100, 0]}>
                  <div className="bg-black/80 backdrop-blur-md border border-blue-500/50 p-4 rounded-xl w-64 text-white shadow-2xl animate-fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-blue-300">{office.name}</h3>
                        <button 
                           onClick={(e) => { e.stopPropagation(); setSelectedOffice(null); }}
                           className="text-gray-400 hover:text-white"
                        >✕</button>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed mb-2">{office.desc}</p>
                      <img 
                        src={`https://source.unsplash.com/400x200/?office,${office.name}`} 
                        alt={office.name} 
                        className="w-full h-24 object-cover rounded mb-2 opacity-80"
                        onError={(e) => e.currentTarget.style.display = 'none'} 
                      />
                      <div className="pt-2 border-t border-gray-700 flex justify-between text-[10px] font-mono text-gray-400">
                          <span>{office.lat.toFixed(1)}°N, {office.lng.toFixed(1)}°E</span>
                          <span>ByteDance</span>
                      </div>
                  </div>
               </Html>
             )}
          </group>
        )
      })}
    </group>
  );
};

// --- Particle Points Component ---
interface InteractivePointsProps {
  config: ParticleConfig;
  handData: React.MutableRefObject<HandData>;
}

const InteractivePoints: React.FC<InteractivePointsProps> = ({ config, handData }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentScale = useRef(1);
  const timeRef = useRef(0);
  
  // --- Countdown State ---
  const [countdownVal, setCountdownVal] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate initial particles
  const initialPositions = useMemo(() => {
    // For countdown, we start with a "Wait" or "Ready" state (just random or text)
    if (config.model === ModelType.COUNTDOWN) {
       // Start with random distribution, will morph to text
       return generateParticles(ModelType.SPHERE, config.particleCount);
    }
    return generateParticles(config.model, config.particleCount);
  }, [config.model, config.particleCount]);

  const currentPositions = useRef<Float32Array>(initialPositions.slice());

  // Reset positions on model change
  useEffect(() => {
    if (config.model !== ModelType.COUNTDOWN) {
      currentPositions.current = initialPositions.slice();
      if (geometryRef.current) {
        geometryRef.current.attributes.position.array.set(initialPositions);
        geometryRef.current.attributes.position.needsUpdate = true;
      }
    } else {
        setCountdownVal(null);
    }
  }, [config.model, initialPositions]);

  // Handle Countdown Text Generation
  useEffect(() => {
    if (config.model === ModelType.COUNTDOWN && countdownVal) {
      const newPos = generateTextParticles(countdownVal, config.particleCount);
      currentPositions.current = newPos;
    }
  }, [countdownVal, config.model, config.particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;
    timeRef.current += delta;
    const hand = handData.current;
    
    // ==========================================
    // 1. COUNTDOWN MODE
    // ==========================================
    if (config.model === ModelType.COUNTDOWN) {
      // Logic: User shows fingers -> Set Text
      if (hand.isDetected) {
         if (hand.gesture === GestureType.FIVE) setCountdownVal("5");
         else if (hand.gesture === GestureType.FOUR) setCountdownVal("4");
         else if (hand.gesture === GestureType.THREE) setCountdownVal("3");
         else if (hand.gesture === GestureType.TWO) setCountdownVal("2");
         else if (hand.gesture === GestureType.ONE) {
             if (countdownVal !== "1" && countdownVal !== "模型效果团队") {
                 setCountdownVal("1");
                 // Trigger special sequence
                 if (timeoutRef.current) clearTimeout(timeoutRef.current);
                 timeoutRef.current = setTimeout(() => {
                     setCountdownVal("模型效果团队");
                 }, 1000);
             }
         }
      }

      // Morphing Logic
      const positions = geometryRef.current.attributes.position.array as Float32Array;
      for (let i = 0; i < config.particleCount; i++) {
        const idx = i * 3;
        // Faster lerp for responsive text
        positions[idx] += (currentPositions.current[idx] - positions[idx]) * 0.1;
        positions[idx + 1] += (currentPositions.current[idx + 1] - positions[idx + 1]) * 0.1;
        positions[idx + 2] += (currentPositions.current[idx + 2] - positions[idx + 2]) * 0.1;
      }
      geometryRef.current.attributes.position.needsUpdate = true;
      
      // Idle animation
      pointsRef.current.rotation.y = Math.sin(timeRef.current * 0.2) * 0.05;
      return; 
    }

    // ==========================================
    // 2. STANDARD MODES (Existing Logic)
    // ==========================================
    
    let activeEffect = config.effect;
    if (hand.isDetected) {
      if (hand.gesture === GestureType.CLOSED_FIST) activeEffect = SceneEffect.EXPLOSION;
      else if (hand.gesture === GestureType.ONE) activeEffect = SceneEffect.SNOW; // Was pointing
      else if (hand.gesture === GestureType.TWO) activeEffect = SceneEffect.FLOW; // Was victory
    }

    // Hand Rotation
    if (hand.isDetected) {
      const rotY = hand.centerX * Math.PI; 
      const rotX = -hand.centerY * Math.PI * 0.5;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, rotX, 0.1);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, rotY, 0.1);
      
      let targetScaleVal = 1;
      if (hand.gesture === GestureType.PINCH) {
         targetScaleVal = 0.5 + (hand.pinchDistance * 2.5);
      }
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScaleVal, config.interactionSensitivity * 0.1);
    } else {
      targetRotation.current.y += delta * 0.1 * config.speed;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, 0, 0.05);
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, 1, 0.05);
    }

    pointsRef.current.rotation.x = targetRotation.current.x;
    pointsRef.current.rotation.y = targetRotation.current.y;
    pointsRef.current.scale.setScalar(currentScale.current);

    // Physics
    const positions = geometryRef.current.attributes.position.array as Float32Array;
    const count = config.particleCount;
    const speed = config.speed * delta;
    const noiseAmt = config.noise * 0.01;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = positions[idx];
      let y = positions[idx + 1];
      let z = positions[idx + 2];
      
      const targetX = initialPositions[idx];
      const targetY = initialPositions[idx + 1];
      const targetZ = initialPositions[idx + 2];

      if (activeEffect === SceneEffect.NONE) {
        x += (targetX - x) * 0.1;
        y += (targetY - y) * 0.1;
        z += (targetZ - z) * 0.1;
        if (config.noise > 0) {
           x += (Math.random() - 0.5) * noiseAmt;
           y += (Math.random() - 0.5) * noiseAmt;
           z += (Math.random() - 0.5) * noiseAmt;
        }
      } 
      else if (activeEffect === SceneEffect.SNOW) {
        y -= speed * 2.0; 
        x += Math.sin(timeRef.current + y) * 0.01;
        if (y < -4) {
          y = 4;
          x = targetX + (Math.random() - 0.5) * 2;
          z = targetZ + (Math.random() - 0.5) * 2;
        }
      }
      else if (activeEffect === SceneEffect.FLOW) {
        const angle = speed * 2.0;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const nx = x * cos - z * sin;
        const nz = x * sin + z * cos;
        x = nx;
        z = nz;
        y = targetY + Math.sin(timeRef.current * 2 + x) * 0.5;
        x += (targetX - x) * 0.01;
        z += (targetZ - z) * 0.01;
      }
      else if (activeEffect === SceneEffect.EXPLOSION) {
        const dist = Math.sqrt(x*x + y*y + z*z) + 0.001;
        const dirX = x / dist;
        const dirY = y / dist;
        const dirZ = z / dist;
        x += dirX * speed * 8.0;
        y += dirY * speed * 8.0;
        z += dirZ * speed * 8.0;
        if (dist > 10) {
           x = targetX; y = targetY; z = targetZ;
        }
      }
      else if (activeEffect === SceneEffect.INK) {
         x += (Math.random() - 0.5) * 0.05 * config.speed;
         y += (Math.random() - 0.5) * 0.05 * config.speed;
         z += (Math.random() - 0.5) * 0.05 * config.speed;
         x += (targetX - x) * 0.02;
         y += (targetY - y) * 0.02;
         z += (targetZ - z) * 0.02;
      }

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={config.particleCount}
            array={new Float32Array(config.particleCount * 3)} 
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={config.particleSize}
          color={config.model === ModelType.COUNTDOWN ? "#00ffff" : config.color} // Neon cyan for countdown
          sizeAttenuation={true}
          transparent={true}
          opacity={config.model === ModelType.COUNTDOWN ? 1.0 : config.opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Countdown Helper Text if Idle */}
      {config.model === ModelType.COUNTDOWN && countdownVal === null && (
         <Html center>
           <div className="text-center animate-pulse pointer-events-none">
             <div className="text-6xl mb-2">✋</div>
             <div className="text-xl font-bold text-cyan-400 bg-black/50 px-4 py-2 rounded-xl border border-cyan-500/50">
               Show Fingers (1-5)
             </div>
           </div>
         </Html>
      )}
    </>
  );
};

interface Props {
  config: ParticleConfig;
  handData: React.MutableRefObject<HandData>;
  onMount?: (scene: THREE.Scene) => void;
}

const ParticleCanvas: React.FC<Props> = ({ config, handData, onMount }) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ scene }) => {
            if(onMount) onMount(scene);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={60} />
        
        {/* Render separate scenes based on model */}
        {config.model === ModelType.WORLD_MAP ? (
           <React.Suspense fallback={<Html center><div className="text-white">Loading Earth...</div></Html>}>
             <Earth3D handData={handData} />
           </React.Suspense>
        ) : (
           <InteractivePoints config={config} handData={handData} />
        )}
        
        <OrbitControls 
            enablePan={config.model === ModelType.WORLD_MAP} 
            enableZoom={true} 
            minDistance={4} 
            maxDistance={20} 
            autoRotate={false} 
            enabled={true} // Always enable mouse for fallback/primary
        />
      </Canvas>
    </div>
  );
};

export default ParticleCanvas;
