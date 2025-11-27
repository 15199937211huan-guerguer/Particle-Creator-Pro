
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleConfig, HandData, SceneEffect, GestureType } from '../types';
import { generateParticles } from '../constants';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
    }
  }
}

interface Props {
  config: ParticleConfig;
  handData: React.MutableRefObject<HandData>;
  onMount?: (scene: THREE.Scene) => void;
}

const InteractivePoints: React.FC<{ config: ParticleConfig; handData: React.MutableRefObject<HandData> }> = ({ config, handData }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentScale = useRef(1);
  const timeRef = useRef(0);

  const initialPositions = useMemo(() => {
    return generateParticles(config.model, config.particleCount);
  }, [config.model, config.particleCount]);

  const currentPositions = useRef<Float32Array>(new Float32Array(0));

  useEffect(() => {
    currentPositions.current = initialPositions.slice();
    if (geometryRef.current) {
      geometryRef.current.attributes.position.needsUpdate = true;
    }
  }, [initialPositions]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;
    
    timeRef.current += delta * config.speed;
    const hand = handData.current;
    
    // --- Determine Active Effect (Gesture Overrides UI) ---
    let activeEffect = config.effect;
    
    if (hand.isDetected) {
      if (hand.gesture === GestureType.CLOSED_FIST) activeEffect = SceneEffect.EXPLOSION;
      else if (hand.gesture === GestureType.POINTING) activeEffect = SceneEffect.SNOW;
      else if (hand.gesture === GestureType.VICTORY) activeEffect = SceneEffect.FLOW;
    }

    // --- 1. Hand Interaction (Rotation & Scale) ---
    if (hand.isDetected) {
      const rotY = hand.centerX * Math.PI; 
      const rotX = -hand.centerY * Math.PI * 0.5;

      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, rotX, 0.1);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, rotY, 0.1);

      // Scale Logic: Pinch or Fist can affect scale? 
      // Let's keep Pinch for Scale.
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

    // --- 2. Dynamic Scene Physics ---
    const positions = geometryRef.current.attributes.position.array as Float32Array;
    const count = config.particleCount;
    const speed = config.speed * delta;
    const noiseAmt = config.noise * 0.01;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = currentPositions.current[idx];
      let y = currentPositions.current[idx + 1];
      let z = currentPositions.current[idx + 2];
      
      const targetX = initialPositions[idx];
      const targetY = initialPositions[idx + 1];
      const targetZ = initialPositions[idx + 2];

      if (activeEffect === SceneEffect.NONE) {
        // Return to shape strongly
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
        // Fall down
        y -= speed * 2.0; 
        x += Math.sin(timeRef.current + y) * 0.01;
        
        // Loop back up
        if (y < -4) {
          y = 4;
          x = targetX + (Math.random() - 0.5) * 2;
          z = targetZ + (Math.random() - 0.5) * 2;
        }
      }
      else if (activeEffect === SceneEffect.FLOW) {
        // Vortex
        const angle = speed * 2.0;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const nx = x * cos - z * sin;
        const nz = x * sin + z * cos;
        x = nx;
        z = nz;
        
        y = targetY + Math.sin(timeRef.current * 2 + x) * 0.5;
        
        // Gentle pull to shape
        x += (targetX - x) * 0.01;
        z += (targetZ - z) * 0.01;
      }
      else if (activeEffect === SceneEffect.EXPLOSION) {
        // Push outward
        const dist = Math.sqrt(x*x + y*y + z*z) + 0.001;
        const dirX = x / dist;
        const dirY = y / dist;
        const dirZ = z / dist;
        
        // Explosion force
        x += dirX * speed * 8.0;
        y += dirY * speed * 8.0;
        z += dirZ * speed * 8.0;
        
        // Limit max distance and reset to create "pulsing boom"
        if (dist > 10) {
           x = targetX;
           y = targetY;
           z = targetZ;
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

      currentPositions.current[idx] = x;
      currentPositions.current[idx+1] = y;
      currentPositions.current[idx+2] = z;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} key={config.model + config.particleCount}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={currentPositions.current.length / 3}
          array={currentPositions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.particleSize}
        color={config.color}
        sizeAttenuation={true}
        transparent={true}
        opacity={config.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

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
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
        
        <InteractivePoints config={config} handData={handData} />
        
        <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={2} 
            maxDistance={20} 
            autoRotate={false} 
        />
      </Canvas>
    </div>
  );
};

export default ParticleCanvas;
