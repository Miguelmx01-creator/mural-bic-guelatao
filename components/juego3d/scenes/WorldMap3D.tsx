'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';
import CommunityNode from '../environment/CommunityNode';
import { COMUNIDADES } from '@/lib/preguntas';

// ─── Posiciones en el mapa ────────────────────────────────────────────────────
export const COMMUNITY_POSITIONS: Record<number, [number, number, number]> = {
  1: [-2.2, 0.5, -1.2],
  2: [ 0.8, 0.5, -2.6],
  3: [-1.4, 0.4,  1.8],
  4: [-2.0, 0.5,  0.6],
  5: [ 2.6, 0.4,  0.4],
};

const CAMINOS: Array<[number, number]> = [
  [1, 2],
  [1, 4],
  [2, 5],
  [4, 3],
  [3, 5],
];

// ─── Terreno hexagonal procedural ────────────────────────────────────────────
function ProceduralTerrain() {
  return (
    <group>
      {/* Plataforma principal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 6]} />
        <meshStandardMaterial color="#1A2E18" roughness={0.9} metalness={0.0} />
      </mesh>
      {/* Borde exterior */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[7, 8.5, 6]} />
        <meshStandardMaterial color="#0F1C0E" roughness={1.0} />
      </mesh>
      {/* Textura de pasto — círculos pequeños decorativos */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r = 2.5 + (i % 3) * 1.2;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[Math.cos(a) * r, 0.002, Math.sin(a) * r]}>
            <circleGeometry args={[0.18 + (i % 4) * 0.06, 6]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#22381E' : '#1C2E19'} depthWrite={false} />
          </mesh>
        );
      })}
      {/* Árboles decorativos (conos) */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + 0.2;
        const r = 5.2 + (i % 3) * 0.5;
        const h = 0.5 + (i % 4) * 0.25;
        return (
          <group key={i} position={[Math.cos(a) * r, h / 2, Math.sin(a) * r]}>
            <mesh castShadow>
              <coneGeometry args={[0.22, h, 6]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#1A3A18' : '#243D1E'} roughness={0.9} />
            </mesh>
            <mesh position={[0, -h / 2 + 0.05, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.25, 5]} />
              <meshStandardMaterial color="#3D2A18" roughness={1.0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Camino entre nodos ───────────────────────────────────────────────────────
function Camino({ from, to, unlocked }: {
  from: [number, number, number];
  to:   [number, number, number];
  unlocked: boolean;
}) {
  const dir    = new THREE.Vector3(to[0] - from[0], 0, to[2] - from[2]);
  const length = dir.length();
  const midX   = (from[0] + to[0]) / 2;
  const midZ   = (from[2] + to[2]) / 2;
  const angle  = Math.atan2(to[0] - from[0], to[2] - from[2]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, -angle]}
      position={[midX, 0.012, midZ]}
    >
      <planeGeometry args={[0.14, length - 1.0]} />
      <meshBasicMaterial
        color={unlocked ? '#8B7A4A' : '#2A3226'}
        transparent
        opacity={unlocked ? 0.75 : 0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Preset de cámara ─────────────────────────────────────────────────────────
function MapCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 9, 8);
    camera.lookAt(0, 0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ─── Iluminación del mapa ─────────────────────────────────────────────────────
function MapLighting() {
  return (
    <>
      <ambientLight color="#8ABAAD" intensity={0.6} />
      <directionalLight
        color="#FFF8E8"
        intensity={1.3}
        position={[-6, 12, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight color="#B8D4C8" intensity={0.35} position={[8, 5, -3]} />
    </>
  );
}

// ─── Escena del mapa mundial ──────────────────────────────────────────────────
export default function WorldMap3D() {
  const { state } = useGame();
  const nivelActual = state.jugador?.nivelActual ?? 1;

  function getStatus(nivel: number): 'locked' | 'available' | 'completed' {
    if (nivel < nivelActual)                        return 'completed';
    if (nivel === nivelActual && nivelActual <= 5)  return 'available';
    return 'locked';
  }

  return (
    <>
      <MapCamera />
      <MapLighting />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={14}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.8}
        target={[0, 0, 0]}
      />
      <fog attach="fog" args={['#0A1205', 16, 30]} />

      <ProceduralTerrain />

      {CAMINOS.map(([a, b]) => {
        const unlocked = getStatus(a) !== 'locked' || getStatus(b) !== 'locked';
        return (
          <Camino
            key={`${a}-${b}`}
            from={COMMUNITY_POSITIONS[a]}
            to={COMMUNITY_POSITIONS[b]}
            unlocked={unlocked}
          />
        );
      })}

      {COMUNIDADES.map((com) => (
        <CommunityNode
          key={com.nivel}
          nivel={com.nivel}
          nombre={com.nombre}
          emoji={com.emoji}
          color={com.color}
          position={COMMUNITY_POSITIONS[com.nivel]}
          status={getStatus(com.nivel)}
          isCurrent={com.nivel === nivelActual && nivelActual <= 5}
        />
      ))}
    </>
  );
}
