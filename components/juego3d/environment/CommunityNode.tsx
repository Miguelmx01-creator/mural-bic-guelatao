'use client';

// Nodo interactivo de comunidad — plataforma escalonada + miniatura arquitectónica.
// Cada nivel tiene una estructura única que evoca el carácter de la comunidad.
// Estados: locked (gris/oscuro) | available (color comunidad) | completed (dorado).

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../engine/GameContext';

type NodeStatus = 'locked' | 'available' | 'completed';

interface CommunityNodeProps {
  nivel: number;
  nombre: string;
  emoji: string;
  color: string;
  position: [number, number, number];
  status: NodeStatus;
  isCurrent: boolean;
}

const LOCKED_COLOR    = '#4A5040';
const COMPLETED_COLOR = '#F2C14E';

// ─── Anillo de partículas orbitando el nodo actual ───────────────────────────
function ParticleRing({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors: colorsAttr } = useMemo(() => {
    const count = 28;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.05 + (Math.random() - 0.5) * 0.12;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      col[i * 3]     = c.r + (Math.random() - 0.5) * 0.2;
      col[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.2;
      col[i * 3 + 2] = c.b + (Math.random() - 0.5) * 0.2;
    }
    return { positions: pos, colors: col };
  }, [color]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.7;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colorsAttr, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

// ─── Estrella de completado ───────────────────────────────────────────────────
function CompletadoStar() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 2.1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    ref.current.rotation.y += 0.02;
  });
  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.14, 0]} />
        <meshToonMaterial color="#F2C14E" emissive="#E5A020" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Miniatura arquitectónica por comunidad ───────────────────────────────────
function MiniStructure({ nivel, active }: { nivel: number; active: boolean }) {
  const stone   = active ? '#7A6840' : '#2A2E22';
  const wood    = active ? '#5C3A18' : '#1C1E14';
  const roof    = active ? '#7A3A10' : '#1A1C10';
  const foliage = active ? '#1E5A1A' : '#141C10';
  const gold    = active ? '#C8A020' : '#252A18';
  const water   = active ? '#1565A4' : '#101820';
  const earth   = active ? '#3A6028' : '#1A2018';

  switch (nivel) {

    // Capulalpam de Méndez — cabaña forestal + pinos
    case 1:
      return (
        <group position={[0, 0.32, 0]}>
          {/* Cabaña */}
          <mesh position={[0.16, 0.1, 0.06]} castShadow>
            <boxGeometry args={[0.26, 0.2, 0.22]} />
            <meshToonMaterial color={stone} />
          </mesh>
          <mesh position={[0.16, 0.24, 0.06]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.21, 0.15, 4]} />
            <meshToonMaterial color={roof} />
          </mesh>
          {/* Puerta */}
          <mesh position={[0.16, 0.07, 0.175]}>
            <boxGeometry args={[0.07, 0.1, 0.01]} />
            <meshToonMaterial color={wood} />
          </mesh>
          {/* Pino grande */}
          <mesh position={[-0.2, 0.0, -0.04]}>
            <cylinderGeometry args={[0.022, 0.03, 0.16, 4]} />
            <meshToonMaterial color={wood} />
          </mesh>
          <mesh position={[-0.2, 0.18, -0.04]} rotation={[0.05, 0.4, -0.04]}>
            <coneGeometry args={[0.15, 0.28, 5]} />
            <meshToonMaterial color={foliage} />
          </mesh>
          <mesh position={[-0.2, 0.36, -0.04]} rotation={[-0.04, 0.8, 0.05]}>
            <coneGeometry args={[0.1, 0.2, 5]} />
            <meshToonMaterial color={active ? '#266822' : '#141C10'} />
          </mesh>
          {/* Pino pequeño */}
          <mesh position={[0.0, 0.0, -0.22]}>
            <cylinderGeometry args={[0.016, 0.022, 0.12, 4]} />
            <meshToonMaterial color={wood} />
          </mesh>
          <mesh position={[0.0, 0.15, -0.22]} rotation={[0, 0.6, 0.04]}>
            <coneGeometry args={[0.1, 0.2, 5]} />
            <meshToonMaterial color={foliage} />
          </mesh>
          {/* Roca decorativa */}
          <mesh position={[-0.08, 0.04, 0.2]} rotation={[0, 0.5, 0]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshToonMaterial color={stone} />
          </mesh>
        </group>
      );

    // Chicomezuchil — iglesia colonial con campanario
    case 2:
      return (
        <group position={[0, 0.32, 0]}>
          {/* Nave de la iglesia */}
          <mesh position={[0.04, 0.12, 0.06]} castShadow>
            <boxGeometry args={[0.38, 0.24, 0.44]} />
            <meshToonMaterial color={stone} />
          </mesh>
          {/* Techo a cuatro aguas */}
          <mesh position={[0.04, 0.27, 0.06]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.3, 0.13, 4]} />
            <meshToonMaterial color={roof} />
          </mesh>
          {/* Torre campanario */}
          <mesh position={[0.04, 0.38, -0.16]} castShadow>
            <boxGeometry args={[0.17, 0.34, 0.17]} />
            <meshToonMaterial color={stone} />
          </mesh>
          {/* Arcos del campanario */}
          <mesh position={[0.04, 0.52, -0.16]}>
            <boxGeometry args={[0.19, 0.06, 0.06]} />
            <meshToonMaterial color={active ? '#9A8860' : '#222820'} />
          </mesh>
          {/* Cúpula */}
          <mesh position={[0.04, 0.58, -0.16]}>
            <sphereGeometry args={[0.095, 6, 5]} />
            <meshToonMaterial color={gold} />
          </mesh>
          {/* Cruz */}
          <mesh position={[0.04, 0.7, -0.16]}>
            <boxGeometry args={[0.03, 0.1, 0.03]} />
            <meshToonMaterial color={gold} />
          </mesh>
          <mesh position={[0.04, 0.74, -0.16]}>
            <boxGeometry args={[0.09, 0.025, 0.025]} />
            <meshToonMaterial color={gold} />
          </mesh>
          {/* Escalones de entrada */}
          <mesh position={[0.04, 0.04, 0.28]}>
            <boxGeometry args={[0.22, 0.06, 0.06]} />
            <meshToonMaterial color={active ? '#6B5A35' : '#202820'} />
          </mesh>
        </group>
      );

    // El Huamuchil — milpa con terrazas y choza circular
    case 3:
      return (
        <group position={[0, 0.32, 0]}>
          {/* Terraza agrícola baja */}
          <mesh position={[-0.08, 0.04, 0.02]} castShadow>
            <boxGeometry args={[0.36, 0.08, 0.44]} />
            <meshToonMaterial color={earth} />
          </mesh>
          {/* Terraza alta */}
          <mesh position={[0.14, 0.1, -0.06]} castShadow>
            <boxGeometry args={[0.28, 0.08, 0.34]} />
            <meshToonMaterial color={active ? '#436830' : '#1A2018'} />
          </mesh>
          {/* Plantas de maíz */}
          {([
            [-0.12, 0.08,  0.1 ],
            [ 0.04, 0.08,  0.14],
            [ 0.16, 0.14, -0.02],
            [-0.08, 0.14, -0.1 ],
            [ 0.28, 0.08,  0.1 ],
          ] as [number,number,number][]).map(([x, y, z], i) => (
            <group key={i} position={[x, y, z]}>
              <mesh>
                <cylinderGeometry args={[0.012, 0.016, 0.22, 4]} />
                <meshToonMaterial color={active ? '#4A8020' : '#1C2210'} />
              </mesh>
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.055, 4, 3]} />
                <meshToonMaterial color={active ? '#68AA28' : '#1A2210'} />
              </mesh>
            </group>
          ))}
          {/* Choza circular */}
          <mesh position={[0.08, 0.22, 0.2]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.16, 6]} />
            <meshToonMaterial color={stone} />
          </mesh>
          <mesh position={[0.08, 0.34, 0.2]}>
            <coneGeometry args={[0.2, 0.18, 6]} />
            <meshToonMaterial color={active ? '#5C4010' : '#1A1808'} />
          </mesh>
        </group>
      );

    // Guelatao de Juárez — laguna + monumento a Benito Juárez
    case 4:
      return (
        <group position={[0, 0.32, 0]}>
          {/* Laguna Encantada */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.18, 0.008, 0.12]}>
            <circleGeometry args={[0.2, 10]} />
            <meshToonMaterial color={water} />
          </mesh>
          {/* Ribera */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.18, 0.003, 0.12]}>
            <ringGeometry args={[0.2, 0.26, 10]} />
            <meshToonMaterial color={active ? '#2A6040' : '#141C10'} />
          </mesh>
          {/* Destello de agua */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.12, 0.012, 0.08]}>
            <planeGeometry args={[0.07, 0.04]} />
            <meshBasicMaterial color="white" opacity={active ? 0.3 : 0} transparent />
          </mesh>
          {/* Pedestal del monumento */}
          <mesh position={[0.18, 0.08, -0.08]} castShadow>
            <boxGeometry args={[0.2, 0.16, 0.2]} />
            <meshToonMaterial color={stone} />
          </mesh>
          {/* Obelisco */}
          <mesh position={[0.18, 0.26, -0.08]} castShadow>
            <boxGeometry args={[0.1, 0.28, 0.1]} />
            <meshToonMaterial color={active ? '#8A7848' : '#282C20'} />
          </mesh>
          {/* Remate piramidal */}
          <mesh position={[0.18, 0.44, -0.08]}>
            <coneGeometry args={[0.08, 0.1, 4]} />
            <meshToonMaterial color={gold} />
          </mesh>
          {/* Árbol ahuejote junto a la laguna */}
          <mesh position={[-0.34, 0.0, -0.08]}>
            <cylinderGeometry args={[0.018, 0.025, 0.18, 4]} />
            <meshToonMaterial color={wood} />
          </mesh>
          <mesh position={[-0.34, 0.2, -0.08]}>
            <sphereGeometry args={[0.1, 5, 4]} />
            <meshToonMaterial color={foliage} />
          </mesh>
          <mesh position={[-0.28, 0.28, -0.04]}>
            <sphereGeometry args={[0.065, 4, 3]} />
            <meshToonMaterial color={active ? '#246830' : '#141C10'} />
          </mesh>
        </group>
      );

    // San Cristóbal Lachirioag — pirámide zapoteca escalonada
    case 5:
      return (
        <group position={[0, 0.32, 0]}>
          {/* Plataforma 1 — base */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.52, 0.1, 0.52]} />
            <meshToonMaterial color={stone} />
          </mesh>
          {/* Plataforma 2 */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[0.38, 0.09, 0.38]} />
            <meshToonMaterial color={active ? '#8C7848' : '#252820'} />
          </mesh>
          {/* Plataforma 3 */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.26, 0.09, 0.26]} />
            <meshToonMaterial color={active ? '#9C8858' : '#2A2E22'} />
          </mesh>
          {/* Templo superior */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.17, 0.16, 0.15]} />
            <meshToonMaterial color={stone} />
          </mesh>
          {/* Techo del templo */}
          <mesh position={[0, 0.43, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.14, 0.1, 4]} />
            <meshToonMaterial color={roof} />
          </mesh>
          {/* Escalera central (frente) */}
          <mesh position={[0, 0.19, 0.27]}>
            <boxGeometry args={[0.1, 0.35, 0.04]} />
            <meshToonMaterial color={active ? '#6B5830' : '#1E2210'} />
          </mesh>
          {/* Glifos laterales (rectángulos decorativos) */}
          <mesh position={[-0.2, 0.14, 0.2]}>
            <boxGeometry args={[0.04, 0.07, 0.02]} />
            <meshToonMaterial color={gold} />
          </mesh>
          <mesh position={[0.2, 0.14, 0.2]}>
            <boxGeometry args={[0.04, 0.07, 0.02]} />
            <meshToonMaterial color={gold} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

// ─── Plataforma hexagonal escalonada (3 capas) ───────────────────────────────
function PlataformaEscalonada({ nodeColor, isInteractable }: { nodeColor: string; isInteractable: boolean }) {
  const darkColor = isInteractable ? '#1E3018' : '#1A1E14';
  const midColor  = isInteractable ? nodeColor : '#2E3828';
  const topColor  = isInteractable ? nodeColor : '#363E2E';

  return (
    <>
      {/* Capa base — ancha y oscura */}
      <mesh position={[0, 0.06, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.88, 0.12, 6]} />
        <meshToonMaterial color={darkColor} />
      </mesh>
      {/* Capa media — rotada para dar variedad */}
      <mesh position={[0, 0.17, 0]} rotation={[0, Math.PI / 3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.78, 0.12, 6]} />
        <meshToonMaterial color={midColor} />
      </mesh>
      {/* Capa superior — cima plana donde descansa la estructura */}
      <mesh position={[0, 0.27, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.64, 0.1, 6]} />
        <meshToonMaterial color={topColor} />
      </mesh>
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CommunityNode({
  nivel,
  nombre,
  emoji,
  color,
  position,
  status,
  isCurrent,
}: CommunityNodeProps) {
  const { dispatch } = useGame();
  const groupRef = useRef<THREE.Group>(null);
  const orbRef   = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const isInteractable = status !== 'locked';
  const nodeColor = status === 'locked'
    ? LOCKED_COLOR
    : status === 'completed'
      ? COMPLETED_COLOR
      : color;

  const scaleRef = useRef(1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (orbRef.current) {
      orbRef.current.position.y = 1.42 + Math.sin(t * 1.4 + nivel) * 0.1;
      if (isInteractable) orbRef.current.rotation.y += 0.008;
    }
    if (glowRef.current && isInteractable) {
      const s = 1 + Math.sin(t * 2.2 + nivel) * 0.12;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.18 + Math.sin(t * 2.2 + nivel) * 0.08;
    }
    if (lightRef.current && isInteractable) {
      lightRef.current.intensity = isCurrent
        ? 1.4 + Math.sin(t * 2.2 + nivel) * 0.4
        : 0.6 + Math.sin(t * 1.6) * 0.15;
    }
    if (groupRef.current && isCurrent) {
      const bounce = 1 + Math.sin(t * 1.8) * 0.025;
      groupRef.current.scale.setScalar(bounce * scaleRef.current);
    }
  });

  function handleClick() {
    if (!isInteractable) return;
    dispatch({ type: 'SET_COMMUNITY', nivel });
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={() => { if (isInteractable) scaleRef.current = 0.92; }}
      onPointerUp={() => { scaleRef.current = 1; }}
      onPointerOut={() => { scaleRef.current = 1; }}
    >
      {/* ── Plataforma escalonada ──────────────────────────────────────────── */}
      <PlataformaEscalonada nodeColor={nodeColor} isInteractable={isInteractable} />

      {/* ── Miniatura arquitectónica de la comunidad ──────────────────────── */}
      <MiniStructure nivel={nivel} active={isInteractable} />

      {/* ── Orb central flotante (dodecaedro facetado) ───────────────────── */}
      <mesh ref={orbRef} position={[0, 1.42, 0]} castShadow>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshToonMaterial
          color={nodeColor}
          emissive={isInteractable ? nodeColor : '#000000'}
          emissiveIntensity={isInteractable ? 0.3 : 0}
        />
      </mesh>

      {/* Glow del orb */}
      {isInteractable && (
        <mesh ref={glowRef} position={[0, 1.42, 0]}>
          <sphereGeometry args={[0.44, 8, 6]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={0.18}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Luz puntual ───────────────────────────────────────────────────── */}
      {isInteractable && (
        <pointLight
          ref={lightRef}
          position={[0, 1.6, 0]}
          color={nodeColor}
          intensity={isCurrent ? 1.6 : 0.6}
          distance={3.5}
          decay={2}
        />
      )}

      {/* ── Número de nivel ───────────────────────────────────────────────── */}
      <Billboard position={[0, 1.05, 0]}>
        <Text
          fontSize={0.3}
          color={status === 'locked' ? '#6B7A60' : '#FFFFFF'}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.02}
        >
          {nivel}
        </Text>
      </Billboard>

      {/* ── Nombre de la comunidad ────────────────────────────────────────── */}
      <Billboard position={[0, -0.32, 0]}>
        <Text
          fontSize={0.2}
          color={isInteractable ? '#FFFFFF' : '#5A6B52'}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.015}
          maxWidth={2.2}
        >
          {nombre}
        </Text>
      </Billboard>

      {/* ── Emoji de comunidad ────────────────────────────────────────────── */}
      <Billboard position={[0, 1.42, 0.32]}>
        <Text fontSize={0.2} anchorX="center" anchorY="middle">
          {emoji}
        </Text>
      </Billboard>

      {/* ── Corona de partículas ──────────────────────────────────────────── */}
      {isCurrent && <ParticleRing color={color} />}

      {/* ── Indicador TAP ─────────────────────────────────────────────────── */}
      {isCurrent && (
        <Billboard position={[0, 2.25, 0]}>
          <Text
            fontSize={0.17}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineColor="#000000"
            outlineWidth={0.015}
          >
            {'▼ TAP'}
          </Text>
        </Billboard>
      )}

      {/* ── Estrella de completado ─────────────────────────────────────────── */}
      {status === 'completed' && <CompletadoStar />}

      {/* ── Candado ───────────────────────────────────────────────────────── */}
      {status === 'locked' && (
        <Billboard position={[0, 1.85, 0]}>
          <Text fontSize={0.28} anchorX="center" anchorY="middle">
            🔒
          </Text>
        </Billboard>
      )}

      {/* ── Sombra en el suelo ─────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.88, 10]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}
