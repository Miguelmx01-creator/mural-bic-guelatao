'use client';

// Mapa 3D interactivo de la Sierra Norte de Oaxaca.
// Vista tablero: cámara orbital desde arriba, 5 nodos de comunidad.
// Conecta con CommunityInfoPanel vía activeCommunityLevel en GameContext.

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';
import SierraTerrain from '../environment/SierraTerrain';
import CommunityNode from '../environment/CommunityNode';
import { COMUNIDADES } from '@/lib/preguntas';

// ─── Posiciones en el mapa ────────────────────────────────────────────────────
// Coordenadas 3D en escala de tablero (unidades Three.js)
// Inspiradas en la geografía de la Sierra Norte: Ixtlán al oeste,
// Villa Alta al este, cordillera norte-sur.

export const COMMUNITY_POSITIONS: Record<number, [number, number, number]> = {
  1: [-2.2, 0.5, -1.5],  // Capulalpam — noreste de Ixtlán
  2: [ 0.5, 0.5, -2.8],  // Chicomezuchil — norte (Ixtlán)
  3: [-1.5, 0.4,  1.8],  // El Huamuchil — sur (Sola de Vega)
  4: [-2.2, 0.5,  0.5],  // Guelatao — centro-oeste (Benito Juárez)
  5: [ 2.8, 0.4,  0.3],  // Lachirioag — este (Villa Alta)
};

// ─── Camino de tierra entre dos comunidades ───────────────────────────────────
function Camino({
  from,
  to,
  unlocked,
}: {
  from: [number, number, number];
  to: [number, number, number];
  unlocked: boolean;
}) {
  const dir = new THREE.Vector3(to[0] - from[0], 0, to[2] - from[2]);
  const length = dir.length();
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const angle = Math.atan2(to[0] - from[0], to[2] - from[2]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, -angle]}
      position={[midX, 0.018, midZ]}
    >
      <planeGeometry args={[0.12, length - 0.9]} />
      <meshBasicMaterial
        color={unlocked ? '#6B5A2A' : '#2E3828'}
        transparent
        opacity={unlocked ? 0.7 : 0.3}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Caminos entre comunidades adyacentes en el mapa ─────────────────────────
const CAMINOS: Array<[number, number]> = [
  [1, 2], // Capulalpam → Chicomezuchil
  [1, 4], // Capulalpam → Guelatao
  [2, 5], // Chicomezuchil → Lachirioag
  [4, 3], // Guelatao → El Huamuchil
  [3, 5], // El Huamuchil → Lachirioag
];

// ─── Preset de cámara para el mapa ───────────────────────────────────────────
function MapCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 8.5, 7.5);
    camera.lookAt(0, 0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ─── Iluminación del mapa (día serrano) ──────────────────────────────────────
function MapLighting() {
  return (
    <>
      {/* Luz ambiente: azul cielo de sierra */}
      <ambientLight color="#8ABAAD" intensity={0.55} />
      {/* Sol principal (noroeste) */}
      <directionalLight
        color="#FFF5E0"
        intensity={1.1}
        position={[-6, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {/* Luz de relleno suave desde el este */}
      <directionalLight color="#B8D4C8" intensity={0.3} position={[8, 5, -3]} />
    </>
  );
}

// ─── Escena del mapa mundial ──────────────────────────────────────────────────
export default function WorldMap3D() {
  const { state } = useGame();
  const nivelActual = state.jugador?.nivelActual ?? 1;

  // nivelActual=1: ningún nivel completado, disponible el nivel 1
  // nivelActual=n: niveles 1..n-1 completados, disponible el n
  // nivelActual=6: todos completados

  function getStatus(nivel: number): 'locked' | 'available' | 'completed' {
    if (nivel < nivelActual) return 'completed';
    if (nivel === nivelActual && nivelActual <= 5) return 'available';
    return 'locked';
  }

  return (
    <>
      <MapCamera />
      <MapLighting />

      {/* ── Controles orbitales (táctiles en móvil) ─────────────────────── */}
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={14}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.8}
        target={[0, 0, 0]}
      />

      {/* ── Terreno ────────────────────────────────────────────────────────── */}
      <SierraTerrain />

      {/* ── Caminos entre comunidades ────────────────────────────────────── */}
      {CAMINOS.map(([a, b]) => {
        const statusA = getStatus(a);
        const statusB = getStatus(b);
        const unlocked = statusA !== 'locked' || statusB !== 'locked';
        return (
          <Camino
            key={`${a}-${b}`}
            from={COMMUNITY_POSITIONS[a]}
            to={COMMUNITY_POSITIONS[b]}
            unlocked={unlocked}
          />
        );
      })}

      {/* ── Nodos de las 5 comunidades ──────────────────────────────────── */}
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

      {/* ── Niebla de sierra (solo en esta escena) ──────────────────────── */}
      <fog attach="fog" args={['#0A1205', 15, 28]} />
    </>
  );
}
